import crypto from 'crypto';

interface MozMetrics {
  domain_authority: number;
  page_authority: number;
  spam_score: number;
  linking_domains: number;
  total_links: number;
  url: string;
}

interface MozApiResponse {
  results: MozMetrics[];
}

export class MozApiService {
  private accessId: string;
  private secretKey: string;
  private baseUrl = 'https://lsapi.seomoz.com/v2/url_metrics';

  constructor() {
    this.accessId = process.env.MOZ_ACCESS_ID!;
    this.secretKey = process.env.MOZ_SECRET_KEY!;
    
    if (!this.accessId || !this.secretKey) {
      throw new Error('Moz API credentials not configured');
    }
  }

  private generateAuthHeader(): string {
    const expires = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
    const stringToSign = `${this.accessId}\n${expires}`;
    const signature = crypto
      .createHmac('sha1', this.secretKey)
      .update(stringToSign)
      .digest('base64');
    
    return `Basic ${Buffer.from(`${this.accessId}:${signature}`).toString('base64')}`;
  }

  async getUrlMetrics(urls: string[]): Promise<MozMetrics[]> {
    try {
      const expires = Math.floor(Date.now() / 1000) + 300;
      const stringToSign = `${this.accessId}\n${expires}`;
      const signature = crypto
        .createHmac('sha1', this.secretKey)
        .update(stringToSign)
        .digest('base64');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.accessId}:${signature}`).toString('base64')}`,
        },
        body: JSON.stringify({
          targets: urls.map(url => ({ target: url })),
          expires: expires
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Moz API error: ${response.status} - ${errorText}`);
      }

      const data: MozApiResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Moz API error:', error);
      throw error;
    }
  }

  async analyzeCompetitor(website: string): Promise<{
    domainAuthority: number;
    pageAuthority: number;
    spamScore: number;
    linkingDomains: number;
    totalLinks: number;
    seoStrength: string;
  }> {
    try {
      // Clean up URL - ensure it has protocol
      let cleanUrl = website.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
      }

      const metrics = await this.getUrlMetrics([cleanUrl]);
      
      if (!metrics || metrics.length === 0) {
        throw new Error('No metrics returned from Moz API');
      }

      const metric = metrics[0];
      
      // Determine SEO strength based on domain authority
      let seoStrength = 'Weak';
      if (metric.domain_authority >= 70) {
        seoStrength = 'Very Strong';
      } else if (metric.domain_authority >= 50) {
        seoStrength = 'Strong';
      } else if (metric.domain_authority >= 30) {
        seoStrength = 'Medium';
      }

      return {
        domainAuthority: metric.domain_authority || 0,
        pageAuthority: metric.page_authority || 0,
        spamScore: metric.spam_score || 0,
        linkingDomains: metric.linking_domains || 0,
        totalLinks: metric.total_links || 0,
        seoStrength
      };
    } catch (error) {
      console.error(`Error analyzing competitor ${website}:`, error);
      // Return default values if API fails
      return {
        domainAuthority: 0,
        pageAuthority: 0,
        spamScore: 0,
        linkingDomains: 0,
        totalLinks: 0,
        seoStrength: 'Unknown'
      };
    }
  }
}

export const mozApi = new MozApiService();