export const banner = (_args?: string[]): string => {
  return `
   ______                        _    ___ ____      __      _
  / ____/__  _________ ______   | |  / (_) / /___ _/ /   __(_)____
 / /   / _ \\/ ___/ __ \`/ ___/   | | / / / / / __ \`/ / | / / / ___/
/ /___/  __(__  ) /_/ / /       | |/ / / / / /_/ / /| |/ / / /
\\____/\\___/____/\\__,_/_/        |___/_/_/_/\\__,_/_/ |___/_/_/
`;
};

export const downloadFile = (uri: string, downloadName: string) => {
    const link = document.createElement("a");
    link.download = downloadName;
    link.href = uri;
    link.click();
    link.remove();
};


export const email = async (email: string) => {
  window.open(`mailto:${email}`);
};
