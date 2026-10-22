import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import type { ImgHTMLAttributes } from 'react'
import { Hero } from '../hero'

// next/image does not work well in the jsdom environment by default
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />
    },
}))

describe('Hero Component', () => {
    it('renders the name (split into per-character spans) in the h1', () => {
        render(<Hero />)
        const h1 = screen.getByRole('heading', { level: 1 })
        expect(h1.textContent).toContain('Satria')
        expect(h1.textContent).toContain('Ibnu')
        expect(h1.textContent).toContain('Safarudin')
    })

    it('renders the role line', () => {
        render(<Hero />)
        expect(screen.getByText('Junior Fullstack Developer')).toBeInTheDocument()
    })

    it('renders location and availability', () => {
        render(<Hero />)
        expect(screen.getByText('Indonesia')).toBeInTheDocument()
        expect(screen.getByText('Available for work')).toBeInTheDocument()
    })
})