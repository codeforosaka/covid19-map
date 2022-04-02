module.exports = {
  apps: [
    {
      name: "covid19-map",
      cwd: "/home/teppei6969/workspace/covid19-map",
      exec_mode: "cluster",
      instances: 2,
      script: "/usr/bin/yarn",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
