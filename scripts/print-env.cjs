const { execFileSync } = require('node:child_process');

console.log('\n=== Ambiente de build Vercel ===');
for (const command of ['node', 'npm', 'npx', 'git']) {
  try {
    const version = execFileSync(command, ['--version'], { encoding: 'utf8' }).trim();
    console.log(`${command} --version: ${version}`);
  } catch (error) {
    console.error(`${command} --version: indisponível (${error.message})`);
    if (command !== 'git') process.exitCode = 1;
  }
}
console.log('================================\n');
