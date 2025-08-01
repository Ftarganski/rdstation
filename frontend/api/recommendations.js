// api/recommendations.js - Vercel Serverless Function para recomendações
const products = [
	{
		id: 1,
		name: 'RD Station CRM',
		category: 'Vendas',
		preferences: [
			'Integração fácil com ferramentas de e-mail',
			'Personalização de funis de vendas',
			'Relatórios avançados de desempenho de vendas',
		],
		features: [
			'Gestão de leads e oportunidades',
			'Automação de fluxos de trabalho de vendas',
			'Rastreamento de interações com clientes',
		],
	},
	{
		id: 2,
		name: 'RD Station Marketing',
		category: 'Marketing',
		preferences: ['Automação de marketing', 'Testes A/B para otimização de campanhas', 'Segmentação avançada de leads'],
		features: [
			'Criação e gestão de campanhas de e-mail',
			'Rastreamento de comportamento do usuário',
			'Análise de retorno sobre investimento (ROI) de campanhas',
		],
	},
	{
		id: 3,
		name: 'RD Conversas',
		category: 'Omnichannel',
		preferences: [
			'Integração com chatbots',
			'Histórico unificado de interações',
			'Respostas automáticas e personalizadas',
		],
		features: [
			'Gestão de conversas em diferentes canais',
			'Chat ao vivo e mensagens automatizadas',
			'Integração com RD Station CRM e Marketing',
		],
	},
	{
		id: 4,
		name: 'RD Mentor AI',
		category: 'Uso de Inteligência Artificial',
		preferences: [
			'Análise preditiva de dados',
			'Recomendações personalizadas para usuários',
			'Integração com assistentes virtuais',
		],
		features: [
			'Análise de dados para insights estratégicos',
			'Recomendação de ações com base em padrões',
			'Integração de funcionalidades preditivas nos produtos RD Station',
		],
	},
];

function calculateRecommendations(preferences = [], features = []) {
	const recommendations = products.map((product) => {
		let score = 0;

		// Calcular pontuação baseada nas preferências
		preferences.forEach((preference) => {
			if (
				product.preferences.some(
					(p) =>
						p.toLowerCase().includes(preference.toLowerCase()) || preference.toLowerCase().includes(p.toLowerCase())
				)
			) {
				score += 2;
			}
		});

		// Calcular pontuação baseada nas features
		features.forEach((feature) => {
			if (
				product.features.some(
					(f) => f.toLowerCase().includes(feature.toLowerCase()) || feature.toLowerCase().includes(f.toLowerCase())
				)
			) {
				score += 1;
			}
		});

		return {
			...product,
			score,
			matchedPreferences: product.preferences.filter((p) =>
				preferences.some(
					(pref) => p.toLowerCase().includes(pref.toLowerCase()) || pref.toLowerCase().includes(p.toLowerCase())
				)
			),
			matchedFeatures: product.features.filter((f) =>
				features.some(
					(feat) => f.toLowerCase().includes(feat.toLowerCase()) || feat.toLowerCase().includes(f.toLowerCase())
				)
			),
		};
	});

	// Ordenar por pontuação e retornar apenas produtos com score > 0
	return recommendations.filter((product) => product.score > 0).sort((a, b) => b.score - a.score);
}

export default function handler(req, res) {
	// Configurar CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// Handle preflight request
	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST', 'OPTIONS']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		const { preferences = [], features = [] } = req.body;

		if (!Array.isArray(preferences) || !Array.isArray(features)) {
			res.status(400).json({
				error: 'Preferences and features must be arrays',
			});
			return;
		}

		const recommendations = calculateRecommendations(preferences, features);

		res.status(200).json({
			recommendations,
			total: recommendations.length,
			criteria: {
				preferences,
				features,
			},
		});
	} catch (error) {
		console.error('Error processing recommendations:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: error.message,
		});
	}
}
