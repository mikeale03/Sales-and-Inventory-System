import { readFile, writeFile } from 'node:fs/promises';

export const createVoidCode = async (code: string) => {
  try {
    await writeFile('../realm/settings.json', code);
    return {
      isSuccess: true,
      message: 'Successfully created a void code',
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      message: 'Failed to create void code',
      error,
    };
  }
};

export const getVoidCode = async () => {
  try {
    const result = await readFile('../realm/settings.json', {
      encoding: 'utf8',
    });
    return {
      isSuccess: true,
      message: 'Successfully get void code',
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      message: 'Failed to get void code',
      error,
    };
  }
};
