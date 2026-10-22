import fs from 'fs'
import path from 'path'
import { PROJECTS_DATA, EXPERIENCE_DATA, TOOLS_DATA } from '../data'
import { projects, getProjectBySlug } from '../projects'

const publicDir = path.join(process.cwd(), 'public')

describe('data sync', () => {
    it('every card slug resolves to a project detail record', () => {
        PROJECTS_DATA.forEach((p) => expect(getProjectBySlug(p.slug)).toBeDefined())
    })

    it('every project detail record has a card', () => {
        const slugs = PROJECTS_DATA.map((p) => p.slug)
        projects.forEach((p) => expect(slugs).toContain(p.slug))
    })

    it('slugs are unique', () => {
        const slugs = PROJECTS_DATA.map((p) => p.slug)
        expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('SmartAI Refrigerator is first (P1)', () => {
        expect(PROJECTS_DATA[0].slug).toBe('smartai-refrigerator')
    })

    it('every referenced local image exists with exact case', () => {
        const paths: string[] = []
        PROJECTS_DATA.forEach((p) => p.image && paths.push(p.image))
        projects.forEach((p) => {
            if (p.aestheticImage) paths.push(p.aestheticImage)
            p.detailImages?.forEach((i) => paths.push(i))
        })
        paths.forEach((p) => {
            const full = path.join(publicDir, p)
            expect(fs.existsSync(full)).toBe(true)
            // existsSync is case-insensitive on some file systems, so compare the real name too.
            expect(fs.readdirSync(path.dirname(full))).toContain(path.basename(full))
        })
    })

    it('experience order: OJT first, DiAntara last', () => {
        expect(EXPERIENCE_DATA[0].company).toBe('PT FAST Indo Talenta')
        expect(EXPERIENCE_DATA[EXPERIENCE_DATA.length - 1].company).toBe('PT. DiAntara Intermedia')
    })

    it('does not expose a Fitalenta repository URL', () => {
        const blob = JSON.stringify([EXPERIENCE_DATA, PROJECTS_DATA, projects, TOOLS_DATA])
        expect(blob).not.toMatch(/github\.com\/[^"]*fitalenta/i)
        expect(blob).not.toMatch(/https?:\/\/[^"]*fitalenta/i)
    })
})
