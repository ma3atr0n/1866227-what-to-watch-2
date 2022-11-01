export default {
  apps : [{
    script: 'npm run ts -- --files ./src/main.ts | pino-pretty --colorize --translateTime SYS:standard',
    watch: 'src'
  },
  ]
};
