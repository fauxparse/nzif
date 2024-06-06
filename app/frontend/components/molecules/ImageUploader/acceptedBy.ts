export const acceptedBy = (accepts: string, file: File) => {
  const accepters = accepts.split(/[,;]\s*/).map((accept) => {
    if (accept.startsWith('.')) return (f: File) => f.name.endsWith(accept);
    const regExp = new RegExp(accept.replace('*', '.*'));
    return (f: File) => regExp.test(f.type);
  });

  return accepters.some((accepter) => accepter(file));
};
