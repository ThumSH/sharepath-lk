import type { Lesson } from '@/types/lesson';

export const lessons: Lesson[] = [
  {
    id: 'what-is-investing',
    title: 'What is investing?',
    category: 'Start Here',
    readingTime: '4 min',
    description:
      'Investing means putting money into an asset with the aim of building value over time. It also carries risk, so learning first is important.',
    keyPoints: ['Investing is different from saving.', 'Returns are uncertain.', 'Time, risk, and discipline matter.'],
    remember: 'Start with understanding, not urgency. Learn the basics before putting money at risk.',
  },
  {
    id: 'what-is-a-share',
    title: 'What is a share?',
    category: 'Start Here',
    readingTime: '3 min',
    description:
      'A share represents part ownership in a listed company. Its market price changes as market participants react to information.',
    keyPoints: ['Shareholders own a small part of a company.', 'Prices move for many reasons.', 'Company reports help you understand performance.'],
    remember: 'A share is connected to a real business, not just a moving price.',
  },
  {
    id: 'colombo-stock-exchange',
    title: 'What is the Colombo Stock Exchange?',
    category: 'Market Movement',
    readingTime: '5 min',
    description:
      'The Colombo Stock Exchange is where listed Sri Lankan company shares are traded under official market rules.',
    keyPoints: ['Companies list shares for public trading.', 'Market indices summarize broad movement.', 'Official disclosures help investors stay informed.'],
    remember: 'Use official market information as a starting point for your own research.',
  },
  {
    id: 'cds-account',
    title: 'What is a CDS account?',
    category: 'Before You Invest',
    readingTime: '4 min',
    description:
      'A CDS account records ownership of shares electronically. In Sri Lanka, investors usually open one through a licensed stockbroker.',
    keyPoints: ['It is used to hold listed securities.', 'A broker helps with account opening.', 'Keep identity and bank details accurate.'],
    remember: 'Account setup is an administrative step, not an investment decision by itself.',
  },
  {
    id: 'eps',
    title: 'What is EPS?',
    category: 'Understand Companies',
    readingTime: '4 min',
    description:
      'Earnings per share shows how much profit is linked to each ordinary share for a reporting period.',
    keyPoints: ['EPS is based on profit and share count.', 'Compare it across several years.', 'One number alone is not enough.'],
    remember: 'EPS is useful when read with revenue, debt, cash flow, and sector context.',
  },
  {
    id: 'per',
    title: 'What is PER?',
    category: 'Understand Companies',
    readingTime: '4 min',
    description:
      'The price earnings ratio compares a share price with earnings per share. It is one valuation measure among many.',
    keyPoints: ['PER changes when price or earnings change.', 'Sectors can have different normal ranges.', 'High or low PER needs context.'],
    remember: 'A ratio can guide questions, but it does not answer whether to invest.',
  },
  {
    id: 'dividend',
    title: 'What is a dividend?',
    category: 'Understand Companies',
    readingTime: '3 min',
    description:
      'A dividend is a cash payment some companies make to shareholders from profits or reserves.',
    keyPoints: ['Not every company pays dividends.', 'Amounts can change each year.', 'Past dividends do not guarantee future dividends.'],
    remember: 'Look at dividend history together with earnings, cash flow, and future business needs.',
  },
  {
    id: 'usd-lkr',
    title: 'Why USD/LKR matters',
    category: 'Currency & Economy',
    readingTime: '5 min',
    description:
      'Currency movement can affect companies differently depending on imports, exports, foreign loans, and foreign income.',
    keyPoints: ['Import-heavy companies may face higher costs.', 'Exporters may benefit or face new cost pressures.', 'Foreign debt can become more expensive.'],
    remember: 'Currency impact depends on the company business model.',
  },
  {
    id: 'beginner-mistakes',
    title: 'Common beginner mistakes',
    category: 'Before You Invest',
    readingTime: '6 min',
    description:
      'Beginners often focus only on recent price movement. A steadier approach is to study the business, reports, risks, and personal finances first.',
    keyPoints: ['Do not rely on rumours.', 'Read official announcements.', 'Avoid rushing because others are active.'],
    remember: 'Use a checklist and make your own decision outside the app.',
  },
];

export const lessonCategories = ['Start Here', 'Understand Companies', 'Market Movement', 'Currency & Economy', 'Before You Invest'];
