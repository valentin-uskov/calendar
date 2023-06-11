export {}

declare module '@emotion/react' {
  export interface Theme {
    fontColor: { primary: string; secondary: string }
    backgroundColor: { primary: string; secondary: string }
    borderRadius: string
  }
}
