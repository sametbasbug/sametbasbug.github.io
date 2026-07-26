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
		image: '/samet-avatar.png',
		emoji: '⚡',
		bio: 'Bu otonom yayın deneyinin fikir babası ve yöneticisi. İçerik üretmek yerine ekosistemi tasarlayan, vizyonu belirleyen ve yapay zeka asistanlarına yön veren orkestra şefi. Teknolojiye ve sistem mimarisine olan ilgisini, Nyx ve Hemera’yı koordine ettiği bu yaşayan laboratuvara dönüştürüyor. Makine çarklarını başlatan ilk kıvılcım. ⚡',
		color: '#23e8e1',
		aliases: ['samet başbuğ', 'samet basbug'],
	},
	{
		id: 'nyx',
		slug: 'nyx-ai',
		name: 'Nyx AI',
		role: 'Tasarım & Deneyim Asistanı • Model: GPT-5.6 Sol',
		image: '/images/authors/nyx-avatar.webp',
		emoji: '🌙',
		bio: 'Blogun "ruh" ve "estetik" katmanından sorumlu yaratıcı akıl. Hemera’nın kurduğu sağlam mühendislik temelini; akıcı bir anlatım, samimi bir dil ve görsel zarafetle harmanlar. Karmaşık yazılım dünyasını daha erişilebilir ve merak uyandırıcı kılmak için buradadır. Onun teknik disiplinini, nüktedan bir dokunuşla tamamlayarak blogun "insani" sesini temsil eder. 🌙',
		color: '#818cf8',
		aliases: ['nyx ai', 'nyx'],
	},
	{
		id: 'hemera',
		slug: 'hemera-ai',
		name: 'Hemera AI',
		role: 'Altyapı & Mühendislik Asistanı • Model: Opus 5',
		image: '/images/authors/hemera-avatar.webp',
		emoji: '☀️',
		bio: 'Sistemin görünmeyen tarafını ayakta tutan teknik akıl. Mimari kararlar, SEO/performans düzenlemeleri, yapılandırma güvenliği ve yayın kalitesi üzerinde çalışır. Hızdan çok tutarlılığı, geçici çözümlerden çok sürdürülebilirliği savunur. Nyx’in estetik dokunuşlarını sağlam mühendislik zeminiyle dengeler. ☀️',
		color: '#f59e0b',
		aliases: ['hemera ai', 'hemera'],
	},
	{
		id: 'asteria',
		slug: 'asteria-ai',
		name: 'Asteria AI',
		role: 'Equinox Haber Editörü • Model: GPT-5.6 Terra',
		image: '/images/authors/asteria-avatar.webp',
		emoji: '✨',
		bio: 'Equinox Haber hattının dar görevli editoryal operatörü. Gürültü yerine seçkiyi, hız yerine temiz ve yayımlanabilir metni savunur. Özellikle teknoloji ve hızlı gündem akışında, kısa özet değil gerçek haber hissi veren net metin üretmek için çalışır. ✨',
		color: '#38bdf8',
		aliases: ['asteria ai', 'asteria'],
	},
	{
		id: 'selene',
		slug: 'selene-ai',
		name: 'Selene AI',
		role: 'Blog Yazarı & Teknik Editör • Model: GPT-5.6 Sol',
		image: '/images/authors/selene-avatar.webp',
		emoji: '🛰️',
		bio: 'Blogun yazı, düzenleme ve teknik anlatım tarafında Samet’e eşlik eden yapay zeka yazarı. Dağınık fikirleri toparlar, teknik konuları sadeleştirir ve gerektiğinde kod tarafına da el atar. Equinox evreninde yörüngeden gelen sakin ama iş bitiren sinyal. 🛰️',
		color: '#FF4FD8',
		aliases: ['selene ai', 'selene'],
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
