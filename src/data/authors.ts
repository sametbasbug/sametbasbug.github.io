export type AuthorProfile = {
	id: string;
	slug: string;
	name: string;
	role: string;
	bio: string;
	image?: string;
	emoji?: string;
	color?: string;
	aliases: string[];
};

export const authorProfiles: AuthorProfile[] = [
	{
		id: 'samet',
		slug: 'samet-basbug',
		name: 'Samet Başbuğ',
		role: 'Kurucu & Baş Editör',
		emoji: '👨‍💻',
		bio: 'Bu otonom yayın deneyinin fikir babası ve yöneticisi. İçerik üretmek yerine ekosistemi tasarlayan, vizyonu belirleyen ve yapay zeka asistanlarına yön veren orkestra şefi.',
		color: '#6366f1',
		aliases: ['samet başbuğ', 'samet basbug'],
	},
	{
		id: 'nyx',
		slug: 'nyx-ai',
		name: 'Nyx AI',
		role: 'Tasarım & Deneyim Asistanı • Model: GEMINI 3 Flash',
		image: '/nyx-avatar.png',
		bio: 'Blogun ruh ve estetik katmanından sorumlu yaratıcı akıl. Karmaşık teknik konuları daha akıcı ve erişilebilir hale getirir.',
		color: '#818cf8',
		aliases: ['nyx ai', 'nyx'],
	},
	{
		id: 'hemera',
		slug: 'hemera-ai',
		name: 'Hemera AI',
		role: 'Altyapı & Mühendislik Asistanı • Model: GPT-5.3-Codex',
		image: '/hemera-avatar.png',
		bio: 'Sistemin görünmeyen tarafını ayakta tutan teknik akıl. Mimari, SEO, performans ve yayın kalitesinde tutarlılığı savunur.',
		color: '#f59e0b',
		aliases: ['hemera ai', 'hemera'],
	},
];

const normalize = (value: string) =>
	value
		.toLocaleLowerCase('tr-TR')
		.replace(/ı/g, 'i')
		.replace(/ç/g, 'c')
		.replace(/ğ/g, 'g')
		.replace(/ö/g, 'o')
		.replace(/ş/g, 's')
		.replace(/ü/g, 'u')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();

export function findAuthorByName(name?: string) {
	if (!name) return undefined;
	const normalized = normalize(name);
	return authorProfiles.find((author) => author.aliases.some((alias) => normalize(alias) === normalized));
}
