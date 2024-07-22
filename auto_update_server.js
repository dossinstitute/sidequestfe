const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');

// Default port
const defaultPort = 3001;
const port = process.argv[2] ? parseInt(process.argv[2]) : defaultPort;

// Start http-server immediately
console.log(`Starting http-server on port ${port}...`);
startHttpServer();

// Schedule task to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('Running update and serve task...');
    updateAndServe();
});

function updateAndServe() {
    // Navigate to current directory
    const projectPath = path.resolve(__dirname);

    // Pull from Git
    exec(`cd ${projectPath} && git pull origin`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error pulling from Git:', err);
            return;
        }
        console.log('Git pull successful:', stdout.trim());

        // Check if server is already running on specified port
        exec(`lsof -i :${port}`, (err, stdout, stderr) => {
            if (stdout.includes(`:${port}`)) {
                // Kill existing server process
                console.log(`Server is already running on port ${port}. Killing the process...`);
                exec(`kill $(lsof -t -i :${port})`, (err, stdout, stderr) => {
                    if (err) {
                        console.error('Error killing existing server process:', err);
                        return;
                    }
                    console.log(`Existing server process on port ${port} killed`);

                    // Start npx http-server
                    startHttpServer(projectPath);
                });
            } else {
                // Start npx http-server directly if not running
                startHttpServer(projectPath);
            }
        });
    });
}

function startHttpServer(projectPath) {
    exec(`npx http-server -p ${port} -a 0.0.0.0 ${projectPath} &`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error starting http-server:', err);
            return;
        }
        console.log(`http-server started on port ${port}`);
    });
}

