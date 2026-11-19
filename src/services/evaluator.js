/** Verificação textual ilustrativa. Não executa Python, não interpreta sintaxe completa. */
export function evaluateDraft(challenge, source) {
  const code = source.split('\n').filter(line => !line.trimStart().startsWith('#')).join('\n');
  if (!code.trim()) return { passed: false, message: 'Escreva uma tentativa antes de verificar.' };
  const failed = challenge.checks.find(check => !check.regex.test(code));
  return failed
    ? { passed: false, message: failed.message }
    : { passed: true, message: 'Boa! Sua solução contém os elementos esperados neste desafio.' };
}
