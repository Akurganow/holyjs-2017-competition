const BS = require('browser-sync')

const config = {
  server: true,
  port: 3001,
  timestamps: false,
  baseDir: process.cwd(),
  files: ['static/**/*'],
  open: false,
  reloadOnRestart: true,
}

BS(config)
