import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { TransitionLink } from '../transition-link'
import { PageTransitionProvider, usePageTransition } from '../page-transition-provider'

const push = jest.fn()
const navigate = jest.fn()

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
    usePathname: () => '/',
}))

jest.mock('../page-transition-provider', () => {
    const actual = jest.requireActual('../page-transition-provider')
    return { ...actual, usePageTransition: () => ({ navigate, markReady: jest.fn() }) }
})

describe('TransitionLink', () => {
    beforeEach(() => navigate.mockClear())

    it('plain click calls navigate', () => {
        render(<TransitionLink href="/projects/x">Go</TransitionLink>)
        fireEvent.click(screen.getByText('Go'))
        expect(navigate).toHaveBeenCalledWith('/projects/x', undefined)
    })

    it.each([
        ['meta', { metaKey: true }],
        ['ctrl', { ctrlKey: true }],
        ['shift', { shiftKey: true }],
        ['middle', { button: 1 }],
    ])('%s click does not call navigate', (_n, init) => {
        render(<TransitionLink href="/projects/x">Go</TransitionLink>)
        fireEvent.click(screen.getByText('Go'), init)
        expect(navigate).not.toHaveBeenCalled()
    })

    it('target=_blank does not call navigate', () => {
        render(<TransitionLink href="/projects/x" target="_blank">Go</TransitionLink>)
        fireEvent.click(screen.getByText('Go'))
        expect(navigate).not.toHaveBeenCalled()
    })
})

describe('PageTransitionProvider reduced motion', () => {
    it('renders no overlay and navigates directly', () => {
        const actual = jest.requireActual('../page-transition-provider')
        window.matchMedia = jest.fn().mockImplementation((q: string) => ({
            matches: q.includes('prefers-reduced-motion'),
            media: q,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        })) as unknown as typeof window.matchMedia
        void usePageTransition

        function Trigger() {
            const { navigate: nav } = actual.usePageTransition()
            return <button onClick={() => nav('/projects/x', { title: 'X' })}>open</button>
        }
        const { container } = render(
            <actual.PageTransitionProvider>
                <Trigger />
            </actual.PageTransitionProvider>
        )
        fireEvent.click(screen.getByText('open'))
        expect(push).toHaveBeenCalledWith('/projects/x')
        expect(container.ownerDocument.querySelector('[data-transition-overlay]')).toBeNull()
    })
})
// keep the import used for type-checking the real provider
void PageTransitionProvider
