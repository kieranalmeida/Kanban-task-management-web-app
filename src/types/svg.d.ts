declare module '*.svg?react' {
  import * as React from 'react'
  const component: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >
  export default component
}