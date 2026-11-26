import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import type { ImgHTMLAttributes } from 'react'
import { Hero } from '../hero'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />
    },
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/',
}))

describe('Hero Component', () => {
    it('renders the full name in the h1', () => {
        render(<Hero />)
        const h1 = screen.getByRole('heading', { level: 1 })
        expect(h1.textContent).toContain('Satria Ibnu')
        expect(h1.textContent).toContain('Safarudin')
    })

    it('renders the role, pixel archive badge, and Sakuga CTAs', () => {
        render(<Hero />)
        expect(screen.getByText('SOFTWARE / BACKEND / SYSTEMS')).toBeInTheDocument()
        expect(screen.getByText('ARCHIVE // 001')).toBeInTheDocument()
        expect(screen.getByText('Explore Projects →')).toBeInTheDocument()
    })

    it('renders location and ASCII portrait', () => {
        render(<Hero />)
        expect(screen.getByText('BANDUNG, INDONESIA')).toBeInTheDocument()
        const portrait = screen.getByAltText('ASCII art portrait of Satria Ibnu Safarudin')
        expect(portrait).toHaveAttribute('src', '/ascii-satria.png')
    })
})
