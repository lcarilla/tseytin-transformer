import {Github} from 'lucide-react'

interface HeaderProps {
	title: string
	repoUrl: string
}

export default function Header({title, repoUrl}: HeaderProps) {
	return (
		<header className="w-full bg-background border-b mb-3">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<a className="text-2xl font-bold text-foreground" href="/">{title}</a>
				<a
					href={repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground hover:text-primary transition-colors"
					aria-label="View source on GitHub"
				>
					<Github className="w-6 h-6"/>
				</a>
			</div>
		</header>
	)
}

