import type { CSSProperties, ElementType, PropsWithChildren } from 'react'
import './Typography.css'

type TypographyProps = {
  size: number
  as?: ElementType
}

export default function Typography({ size, children, as: Component = 'h1' }: PropsWithChildren<TypographyProps>) {
  const style: CSSProperties = {
    '--font-size': `${size}px`,
  }

  return <Component style={style}>{children}</Component>
}
