const cluster = require("cluster");
const os = require("os");
const process = require("process");
const cpuNums = os.cpus().length;

let workers = {}

if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);

    for (var i = 0; i < cpuNums; i++) {
        const worker = cluster.fork();
        // worker.on('listening', (address) => {
        //     console.log(address)
        //     worker.send('shutdown');
        //     worker.disconnect();
        //     timeout = setTimeout(() => {
        //         worker.kill();
        //     }, 2000);
        // });
        workers[worker.process.pid] = worker;
    }

    cluster.on('exit', (worker, code, signal) => {
        // 当一个工作进程结束时，重启工作进程
        delete workers[worker.process.pid];
        worker = cluster.fork();
        workers[worker.process.pid] = worker;
    });

} else {
    var app = require("./app");
    app.use(async (ctx, next) => {
        console.log('worker' + cluster.worker.id + ',PID:' + process.pid);
        await next()
    });
    app.listen(3000);
}

// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function () {
    for (var pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});
require('./test')
