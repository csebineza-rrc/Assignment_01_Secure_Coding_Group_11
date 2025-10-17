declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string,
      USER: string,
      PASSWORD: string,
      DATABASE: string
    }
  }
}

export {};
