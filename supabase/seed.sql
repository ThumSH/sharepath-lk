delete from public.official_updates;
delete from public.currency_rates;
delete from public.market_summaries;
delete from public.company_announcements;
delete from public.company_financials;
delete from public.lessons;
delete from public.companies;

insert into public.companies (
  symbol,
  name,
  sector,
  current_price,
  one_year_movement,
  fifty_two_week_high,
  fifty_two_week_low,
  market_cap_label,
  last_updated,
  summary,
  dividend_note
) values
('COMB.N0000', 'Commercial Bank of Ceylon PLC', 'Banking', 132.50, 18.4, 146.00, 98.20, 'Large cap', '14 Aug 2026', 'Commercial Bank is a long-established Sri Lankan bank with retail, corporate, and international banking operations.', 'Paid interim and final dividends across recent years, subject to board approval and performance.'),
('JKH.N0000', 'John Keells Holdings PLC', 'Diversified Holdings', 23.80, 9.7, 27.40, 18.60, 'Large cap', '14 Aug 2026', 'John Keells Holdings has exposure to leisure, transport, consumer foods, property, retail, and financial services.', 'Dividend payments have varied with group earnings and capital requirements.'),
('DIAL.N0000', 'Dialog Axiata PLC', 'Telecommunication', 11.40, -3.2, 14.10, 9.80, 'Large cap', '14 Aug 2026', 'Dialog Axiata provides mobile, fixed broadband, digital television, and enterprise communication services.', 'The company has a history of cash dividends, with amounts changing by year.'),
('HAYL.N0000', 'Hayleys PLC', 'Diversified Holdings', 91.20, 6.1, 102.30, 74.60, 'Mid to large cap', '14 Aug 2026', 'Hayleys operates across exports, agriculture, transportation, consumer goods, purification, textiles, and industrial solutions.', 'Past dividends reflect historic earnings and board decisions.'),
('LOLC.N0000', 'LOLC Holdings PLC', 'Financial Services', 548.75, 12.9, 620.00, 412.00, 'Large cap', '14 Aug 2026', 'LOLC Holdings has financial services and strategic investment interests in Sri Lanka and overseas markets.', 'Dividend history should be reviewed together with reinvestment and expansion activity.');

insert into public.company_financials (
  company_symbol,
  revenue,
  profit_after_tax,
  eps,
  nav_per_share
) values
('COMB.N0000', 'LKR 349.2B', 'LKR 36.9B', 'LKR 28.42', 'LKR 201.30'),
('JKH.N0000', 'LKR 292.7B', 'LKR 22.1B', 'LKR 1.42', 'LKR 31.80'),
('DIAL.N0000', 'LKR 189.5B', 'LKR 14.3B', 'LKR 1.75', 'LKR 8.60'),
('HAYL.N0000', 'LKR 487.4B', 'LKR 19.8B', 'LKR 26.41', 'LKR 162.10'),
('LOLC.N0000', 'LKR 311.6B', 'LKR 41.7B', 'LKR 87.86', 'LKR 716.40');

insert into public.company_announcements (
  company_symbol,
  title,
  category,
  published_date,
  summary,
  source_label
) values
('COMB.N0000', 'Quarterly financial statements published', 'Financial report', '14 Aug 2026', 'Sample official update summary for educational review.', 'Sample data'),
('COMB.N0000', 'Dividend distribution notice', 'Dividend', '14 Aug 2026', 'Sample dividend notice summary for educational review.', 'Sample data'),
('JKH.N0000', 'Interim financial report released', 'Financial report', '14 Aug 2026', 'Sample interim report summary for educational review.', 'Sample data'),
('DIAL.N0000', 'Network investment update', 'Corporate disclosure', '14 Aug 2026', 'Sample corporate disclosure summary for educational review.', 'Sample data'),
('HAYL.N0000', 'Annual report published', 'Financial report', '14 Aug 2026', 'Sample annual report summary for educational review.', 'Sample data'),
('LOLC.N0000', 'Rights issue notice summary', 'Corporate disclosure', '14 Aug 2026', 'Sample rights issue notice summary for educational review.', 'Sample data');

insert into public.lessons (
  id,
  title,
  category,
  reading_time,
  description,
  content,
  key_points,
  remember,
  sort_order
) values
('what-is-investing', 'What is investing?', 'Start Here', '4 min', 'Investing means putting money into an asset with the aim of building value over time. It also carries risk, so learning first is important.', 'Investing is easier to understand when you connect it to real assets, time, and uncertainty. SharePath LK uses educational summaries to help beginners build context before making decisions outside the app.', array['Investing is different from saving.', 'Returns are uncertain.', 'Time, risk, and discipline matter.'], 'Start with understanding, not urgency. Learn the basics before putting money at risk.', 1),
('what-is-a-share', 'What is a share?', 'Start Here', '3 min', 'A share represents part ownership in a listed company. Its market price changes as market participants react to information.', 'A listed share is connected to a real company. Company reports, sector changes, and official disclosures can all help explain historical movement.', array['Shareholders own a small part of a company.', 'Prices move for many reasons.', 'Company reports help you understand performance.'], 'A share is connected to a real business, not just a moving price.', 2),
('colombo-stock-exchange', 'What is the Colombo Stock Exchange?', 'Market Movement', '5 min', 'The Colombo Stock Exchange is where listed Sri Lankan company shares are traded under official market rules.', 'The CSE provides the market structure for listed company trading, disclosures, and broad market indices. Beginners can use official information to learn what happened historically.', array['Companies list shares for public trading.', 'Market indices summarize broad movement.', 'Official disclosures help investors stay informed.'], 'Use official market information as a starting point for your own research.', 3),
('cds-account', 'What is a CDS account?', 'Before You Invest', '4 min', 'A CDS account records ownership of shares electronically. In Sri Lanka, investors usually open one through a licensed stockbroker.', 'A CDS account is part of the market access process. It records securities ownership, while decisions about what to study or whether to invest remain personal decisions outside this app.', array['It is used to hold listed securities.', 'A broker helps with account opening.', 'Keep identity and bank details accurate.'], 'Account setup is an administrative step, not an investment decision by itself.', 4),
('eps', 'What is EPS?', 'Understand Companies', '4 min', 'Earnings per share shows how much profit is linked to each ordinary share for a reporting period.', 'EPS can help you ask better questions about company profitability. It should be reviewed with revenue, debt, cash flow, and sector context.', array['EPS is based on profit and share count.', 'Compare it across several years.', 'One number alone is not enough.'], 'EPS is useful when read with revenue, debt, cash flow, and sector context.', 5),
('per', 'What is PER?', 'Understand Companies', '4 min', 'The price earnings ratio compares a share price with earnings per share. It is one valuation measure among many.', 'PER changes when either price or earnings changes. Beginners should compare it with sector context and several years of company history.', array['PER changes when price or earnings change.', 'Sectors can have different normal ranges.', 'High or low PER needs context.'], 'A ratio can guide questions, but it does not answer whether to invest.', 6),
('dividend', 'What is a dividend?', 'Understand Companies', '3 min', 'A dividend is a cash payment some companies make to shareholders from profits or reserves.', 'Dividend history can show how a company has distributed cash in the past. Past dividends do not guarantee future dividends.', array['Not every company pays dividends.', 'Amounts can change each year.', 'Past dividends do not guarantee future dividends.'], 'Look at dividend history together with earnings, cash flow, and future business needs.', 7),
('usd-lkr', 'Why USD/LKR matters', 'Currency & Economy', '5 min', 'Currency movement can affect companies differently depending on imports, exports, foreign loans, and foreign income.', 'USD/LKR movement can affect costs and income differently across Sri Lankan companies. The impact depends on the company business model.', array['Import-heavy companies may face higher costs.', 'Exporters may benefit or face new cost pressures.', 'Foreign debt can become more expensive.'], 'Currency impact depends on the company business model.', 8),
('beginner-mistakes', 'Common beginner mistakes', 'Before You Invest', '6 min', 'Beginners often focus only on recent price movement. A steadier approach is to study the business, reports, risks, and personal finances first.', 'A careful beginner uses official updates, company history, and a simple checklist. Avoid rushing because a price has recently moved.', array['Do not rely on rumours.', 'Read official announcements.', 'Avoid rushing because others are active.'], 'Use a checklist and make your own decision outside the app.', 9);

insert into public.market_summaries (
  summary_date,
  aspi,
  sp_sl20,
  turnover,
  traded_companies,
  top_gainer,
  top_loser,
  most_traded,
  source_label
) values
(current_date, '12,486.42', '3,721.09', 'LKR 2.8B', 247, 'Sample Finance PLC', 'Sample Hotels PLC', 'Sample Holdings PLC', 'Sample data');

insert into public.currency_rates (
  code,
  pair,
  rate,
  movement,
  source_label,
  updated_at
) values
('USD', 'USD/LKR', '303.40', '+0.2%', 'Sample data', '14 Aug 2026'),
('GBP', 'GBP/LKR', '397.80', '-0.1%', 'Sample data', '14 Aug 2026'),
('EUR', 'EUR/LKR', '351.20', '+0.3%', 'Sample data', '14 Aug 2026'),
('AUD', 'AUD/LKR', '198.70', '+0.1%', 'Sample data', '14 Aug 2026');

insert into public.official_updates (
  title,
  category,
  published_date,
  summary,
  source_label
) values
('Interim financial report published', 'Financial report', '14 Aug 2026', 'Official update summary: interim financial report published for sample educational review.', 'Sample data'),
('Dividend announcement released', 'Dividend', '14 Aug 2026', 'Official update summary: dividend announcement released for sample educational review.', 'Sample data'),
('Corporate disclosure filed', 'Corporate disclosure', '14 Aug 2026', 'Official update summary: corporate disclosure filed for sample educational review.', 'Sample data'),
('Rights issue notice published', 'Corporate disclosure', '14 Aug 2026', 'Official update summary: rights issue notice published for sample educational review.', 'Sample data');
