const port = 3000;
const express = require("express");
const app = express();
var exec = require("child_process").exec;
const { legacyCreateProxyMiddleware } = require("http-proxy-middleware");

app.get("/", function (req, res) {
  res.type("html").send('<p>website building....</p>');
});

app.get("/listen", function (req, res) {
  let cmdStr = "ss -nltp";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>获取系统监听端口：\n" + stdout + "</pre>");
    }
  });
});
// 新添加的 /ip 路由
app.get("/ip", function (req, res) {
  const networkInterfaces = os.networkInterfaces();
  let ip = 'Unknown';

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // 跳过内部IP地址
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address;
        break;
      }
    }
    if (ip !== 'Unknown') break;
  }

  res.send(`当前IP地址: ${ip}`);
});

app.use(
  legacyCreateProxyMiddleware({
    target: 'http://127.0.0.1:8080/',
    ws: true,
    changeOrigin: true,
    on: {  /* http代理事件集 */
          proxyRes: function proxyRes(proxyRes, req, res) {
//             console.log(res) //for debug
          },
          proxyReq: function proxyReq(proxyReq, req, res) {
//             console.log(proxyReq); //for debug
//             console.log(req) //for debug
//             console.log(res) //for debug
          },
          error: function error(err, req, res) {
//            console.warn('websocket error.', err);
          }
        },
    pathRewrite: {
      '^/': '/',
    },
//     logger: console
  })
);

exec("bash entrypoint.sh", function (err, stdout, stderr) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

app.listen(port, () => console.log(`port ${port}!`));
