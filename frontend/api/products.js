// api/products.js - Vercel Serverless Function
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

export default function handler(req, res) {
	// Configurar CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// Handle preflight request
	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	const { method, query } = req;

	switch (method) {
		case 'GET':
			if (query.id) {
				const product = products.find((p) => p.id === parseInt(query.id));
				if (product) {
					res.status(200).json(product);
				} else {
					res.status(404).json({ error: 'Product not found' });
				}
			} else {
				res.status(200).json(products);
			}
			break;

		case 'POST':
			const newProduct = {
				id: products.length + 1,
				...req.body,
			};
			products.push(newProduct);
			res.status(201).json(newProduct);
			break;

		case 'PUT':
			if (query.id) {
				const productIndex = products.findIndex((p) => p.id === parseInt(query.id));
				if (productIndex !== -1) {
					products[productIndex] = { ...products[productIndex], ...req.body };
					res.status(200).json(products[productIndex]);
				} else {
					res.status(404).json({ error: 'Product not found' });
				}
			} else {
				res.status(400).json({ error: 'Product ID is required' });
			}
			break;

		case 'DELETE':
			if (query.id) {
				const productIndex = products.findIndex((p) => p.id === parseInt(query.id));
				if (productIndex !== -1) {
					const deletedProduct = products.splice(productIndex, 1)[0];
					res.status(200).json(deletedProduct);
				} else {
					res.status(404).json({ error: 'Product not found' });
				}
			} else {
				res.status(400).json({ error: 'Product ID is required' });
			}
			break;

		default:
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
