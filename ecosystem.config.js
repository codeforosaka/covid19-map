module.exports = {
  apps: [
    {
      name: "covid19-map",
      cwd: "/home/teppei6969/workspace/covid19-map",
      exec_mode: "fork",
      instances: 1,
      script: "/usr/bin/yarn start",
      args: "",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
