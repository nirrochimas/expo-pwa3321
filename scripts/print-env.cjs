const { execFileSync } = require('node:child_process');

console.log('\n=== Ambiente de build Vercel ===');
console.log(`node --version: ${process.version}`);
for (const command of ['npm', 'npx', 'git']) {
  try {
    const version = execFileSync(command, ['--version'], { encoding: 'utf8' }).trim();
    console.log(`${command} --version: ${version}`);
  } catch (error) {
    console.error(`${command} --version: indisponível (${error.message})`);
    if (command !== 'git') process.exitCode = 1;
  }
}
console.log('================================\n');
