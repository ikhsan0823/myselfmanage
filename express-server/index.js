const { req, res } = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const { app, Users, Daily, File, upload, Balance, History } = require('./config');
const Server = http.createServer(app);
const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("dashboard");
        return;
    } else {
        return res.redirect("index.html");
    }
});
Server.listen(PORT);

app.get("/livechat", (req, res) => {
    const username = req.session.user;
    res.render('example', { username: username });
});

app.post("/signup", async function (req, res) {
    try {
        const existingUser = await Users.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

        if (existingUser) {
            const alertScript = `
                <script>
                    alert('Username or email already taken!');
                    window.location.href = '/';
                </script>
            `;
            res.send(alertScript);
            return;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let newUsers = new Users({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        let newBalance = new Balance({
            username: req.body.username,
            value: 0
        });

        await newUsers.save();
        await newBalance.save();

        res.redirect('/');
    } catch (error) {
        console.error('An error occurred during signup:', error);
        res.status(500).send('An error occurred during signup.');
    }
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await Users.findOne({ username: username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            const alertScript = `
                <script>
                    alert('Invalid username or password. Please try again.');
                    window.location.href = '/';
                </script>
            `;
            res.send(alertScript);
            return;
        }

        console.log("Login successfully from " + username + "!");
        req.session.user = username;
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    const username = req.session.user;
    res.render("dashboard", { username: username});
});

app.get("/daily", (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    res.render('daily')
});

app.get("/money", (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    res.render('money');
});

app.post("/dailytask", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    try {
        let newDaily = new Daily({
            username: req.session.user,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            uniqueId: req.body.uniqueId,
            nameday: req.body.nameday
        });

        await newDaily.save();
        res.status(200).json({ success: true, message: 'Daily task saved successfully' });
    } catch (error) {
        console.error("Error saving daily task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } 
});

app.get("/carddaily", async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }

    try {
        const dailyTasks = await Daily.find({ username: req.session.user });
        const formattedTask = dailyTasks.map(task => ({
            username: task.username,
            title: task.title,
            description: task.description,
            date: task.date,
            uniqueId: task.uniqueId,
            nameday: task.nameday
        }));

        res.json({ dailyTasks: formattedTask });
    } catch (error) {
        console.error("Error retrieving daily tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/dailytask/:uniqueId", async (req, res) => {
    const uniqueId = req.params.uniqueId
    try {
        const deleteTask = await Daily.findOneAndDelete({ uniqueId: uniqueId });

        if (!deleteTask) {
            res.status(404).json({ success: false, maessage: 'Task not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error'});
    }
});

app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (!req.file) {
            const alertScript = `
                <script>
                    alert('No images uploaded!');
                    window.location.href = '/daily';
                </script>
            `;
            res.send(alertScript);
            return;
        }

        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }

        const newFile = new File({
            username: req.session.user,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uniqueId: req.body.uniqueId
        });

        try {
            await newFile.save();
            await Daily.findOneAndDelete({ uniqueId: req.body.uniqueId });
            res.redirect("daily");
        } catch (error) {
            console.error('Error saving file info to MongoDB:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    });
});

app.get('/getBalance', async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    try {
        const balance = await Balance.findOne({ username: req.session.user });
        if (balance) {
            res.json({ value: balance.value });
        } else {
            res.status(404).json({ error: 'Balance data not found!' });
        }
    } catch (error) {
        console.error('An error occurred while getting the balance:', error);
        res.status(500).send('An error occurred while getting the balance,');
    }
})

app.post('/updateBalance', async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    const newValue = req.body.balance;
    try {
        await Balance.findOneAndUpdate({ username: req.session.user }, { value: newValue }, { upsert: true, new: true });
        res.send('Successfully updated balance.');
    } catch (error) {
        res.status(500).send('An error occurred while updating the balance!');
    }
});

app.post("/history", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    try {
        let newHistory = new History({
            username: req.session.user,
            formattedDate: req.body.formattedDate,
            formattedTime: req.body.formattedTime,
            type: req.body.type,
            depositeAmount: req.body.depositeAmount,
            withdrawAmount: req.body.withdrawAmount
        });

        await newHistory.save();
        res.status(200).json({ success: true, message: 'Daily task saved successfully' });
    } catch (error) {
        console.error("Error saving daily task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } 
});

app.get("/gethistory", async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }

    try {
        const getHistory = await History.find({ username: req.session.user });
        const formattedHistory = getHistory.map(history => ({
            username: history.username,
            formattedDate: history.formattedDate,
            formattedTime: history.formattedTime,
            type: history.type,
            depositeAmount: history.depositeAmount,
            withdrawAmount: history.withdrawAmount
        }));

        res.json({ getHistory: formattedHistory });
    } catch (error) {
        console.error("Error retrieving daily tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.json({ success: true, message: "Logout successful" });
        }
    });
});