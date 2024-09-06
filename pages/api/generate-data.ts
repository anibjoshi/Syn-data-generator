import type { NextApiRequest, NextApiResponse } from 'next'

type GeneratedData = {
  [key: string]: string | number | boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratedData[] | { error: string }>
) {
  console.log('API route hit:', req.method);
  if (req.method === 'POST') {
    try {
      const { schema, rowCount } = req.body;
      console.log('Received schema:', schema);
      console.log('Received rowCount:', rowCount);

      if (!schema || !Array.isArray(schema)) {
        throw new Error('Invalid schema provided');
      }

      // Generate dummy data based on the schema
      const dummyData = schema.map((column: any) => {
        switch (column.type) {
          case 'Numeric':
            return { [column.name]: Math.floor(Math.random() * 1000) }
          case 'String':
            return { [column.name]: `Sample ${column.name}` }
          case 'Date/Time':
            return { [column.name]: new Date().toISOString() }
          case 'Boolean':
            return { [column.name]: Math.random() > 0.5 }
          default:
            return { [column.name]: 'Dummy value' }
        }
      });

      // Combine the dummy data into rows
      const generatedData = Array.from({ length: rowCount || 10 }, () =>
        Object.assign({}, ...dummyData)
      );

      console.log('Generated data:', generatedData);
      res.status(200).json(generatedData);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: 'Failed to generate data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}