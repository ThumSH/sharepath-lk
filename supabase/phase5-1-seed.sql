insert into public.glossary_terms (
  term, short_definition, detailed_definition, category, related_lesson_id, sort_order, source_label
) values
('ASPI', 'The All Share Price Index summarizes broad share price movement on the Colombo Stock Exchange.', 'ASPI is a broad market index. It helps learners understand overall historical market movement, but it does not describe every company equally.', 'Market Movement', 'colombo-stock-exchange', 1, 'Educational content'),
('S&P SL20', 'An index that tracks selected large and liquid listed companies in Sri Lanka.', 'S&P SL20 can provide context for larger-company market movement. It should be read as historical market context, not as guidance to choose a share.', 'Market Movement', 'colombo-stock-exchange', 2, 'Educational content'),
('Share', 'A share represents part ownership in a listed company.', 'Share prices move as market participants react to information, risk, liquidity, and wider market conditions.', 'Start Here', 'what-is-a-share', 3, 'Educational content'),
('Dividend', 'A cash payment some companies make to shareholders from profits or reserves.', 'Dividend history can be useful to review, but past dividends do not guarantee future dividends.', 'Understand Companies', 'dividend', 4, 'Educational content'),
('EPS', 'Earnings per share shows profit linked to each ordinary share.', 'EPS is usually reviewed across several years together with revenue, debt, cash flow, and sector context.', 'Understand Companies', 'eps', 5, 'Educational content'),
('PER', 'The price earnings ratio compares share price with earnings per share.', 'PER is one valuation measure. It needs sector and historical context before it can guide research questions.', 'Understand Companies', 'per', 6, 'Educational content'),
('PBV', 'Price to book value compares share price with net asset value per share.', 'PBV can help compare market price with accounting net assets, but asset quality and sector context matter.', 'Understand Companies', null, 7, 'Educational content'),
('NAV', 'Net asset value describes assets minus liabilities, often shown per share.', 'NAV per share is an accounting measure and should be reviewed with earnings, cash flow, and business quality.', 'Understand Companies', 'eps', 8, 'Educational content'),
('PAT', 'Profit after tax is the profit remaining after tax expenses.', 'PAT is commonly reviewed across multiple years to understand historical profitability.', 'Understand Companies', null, 9, 'Educational content'),
('Revenue', 'Revenue is income earned from business activities before expenses.', 'Revenue trends help learners ask whether a business has grown, contracted, or stayed stable historically.', 'Understand Companies', null, 10, 'Educational content'),
('Turnover', 'Market turnover is the value of shares traded during a period.', 'Turnover can give context about market activity and liquidity, but it is not a recommendation signal.', 'Market Movement', null, 11, 'Educational content'),
('Market Capitalization', 'Market capitalization is share price multiplied by the number of shares.', 'It is a size measure. It does not by itself explain whether a company is suitable for any person.', 'Understand Companies', null, 12, 'Educational content'),
('52-week high', 'The highest traded price shown for a share over the past 52 weeks.', 'It is a historical reference point and does not predict future prices.', 'Market Movement', null, 13, 'Educational content'),
('52-week low', 'The lowest traded price shown for a share over the past 52 weeks.', 'It is a historical reference point and should be reviewed with company and market context.', 'Market Movement', null, 14, 'Educational content'),
('CDS Account', 'An account that records listed securities ownership electronically.', 'In Sri Lanka, investors usually open a CDS account through a licensed stockbroker.', 'Before You Invest', 'cds-account', 15, 'Educational content'),
('Stockbroker', 'A licensed intermediary that helps investors access the share market.', 'A stockbroker supports market access and administration. Investment decisions remain the user’s responsibility outside the app.', 'Before You Invest', 'cds-account', 16, 'Educational content'),
('Rights Issue', 'An offer for existing shareholders to subscribe for additional shares under stated terms.', 'Rights issues can affect share count, ownership percentages, and capital structure, so official documents should be reviewed.', 'Official Updates', null, 17, 'Educational content'),
('Corporate Disclosure', 'An official company announcement shared with the market.', 'Corporate disclosures help explain what happened historically and should be read from official sources.', 'Official Updates', null, 18, 'Educational content')
on conflict (term) do update set
  short_definition = excluded.short_definition,
  detailed_definition = excluded.detailed_definition,
  category = excluded.category,
  related_lesson_id = excluded.related_lesson_id,
  sort_order = excluded.sort_order,
  source_label = excluded.source_label,
  updated_at = now();

insert into public.top_movers (
  mover_date, company_symbol, company_name, movement_type, change_percent, traded_volume, turnover, source_label
) values
('2026-08-14', 'COMB.N0000', 'Commercial Bank of Ceylon PLC', 'gainer', 3.20, 230000, 30475000.00, 'Sample data'),
('2026-08-14', 'JKH.N0000', 'John Keells Holdings PLC', 'gainer', 2.40, 239000, 5688200.00, 'Sample data'),
('2026-08-14', 'HAYL.N0000', 'Hayleys PLC', 'gainer', 1.80, 257000, 23438400.00, 'Sample data'),
('2026-08-14', 'LOLC.N0000', 'LOLC Holdings PLC', 'gainer', 1.60, 266000, 145967500.00, 'Sample data'),
('2026-08-14', 'DIAL.N0000', 'Dialog Axiata PLC', 'gainer', 0.70, 248000, 2827200.00, 'Sample data'),
('2026-08-14', 'DIAL.N0000', 'Dialog Axiata PLC', 'loser', -1.40, 248000, 2827200.00, 'Sample data'),
('2026-08-14', 'JKH.N0000', 'John Keells Holdings PLC', 'loser', -0.80, 239000, 5688200.00, 'Sample data'),
('2026-08-14', 'HAYL.N0000', 'Hayleys PLC', 'loser', -0.60, 257000, 23438400.00, 'Sample data'),
('2026-08-14', 'COMB.N0000', 'Commercial Bank of Ceylon PLC', 'loser', -0.40, 230000, 30475000.00, 'Sample data'),
('2026-08-14', 'LOLC.N0000', 'LOLC Holdings PLC', 'loser', -0.20, 266000, 145967500.00, 'Sample data'),
('2026-08-14', 'LOLC.N0000', 'LOLC Holdings PLC', 'most_traded', null, 266000, 145967500.00, 'Sample data'),
('2026-08-14', 'COMB.N0000', 'Commercial Bank of Ceylon PLC', 'most_traded', null, 230000, 30475000.00, 'Sample data'),
('2026-08-14', 'HAYL.N0000', 'Hayleys PLC', 'most_traded', null, 257000, 23438400.00, 'Sample data'),
('2026-08-14', 'JKH.N0000', 'John Keells Holdings PLC', 'most_traded', null, 239000, 5688200.00, 'Sample data'),
('2026-08-14', 'DIAL.N0000', 'Dialog Axiata PLC', 'most_traded', null, 248000, 2827200.00, 'Sample data')
on conflict (mover_date, company_symbol, movement_type) do update set
  company_name = excluded.company_name,
  change_percent = excluded.change_percent,
  traded_volume = excluded.traded_volume,
  turnover = excluded.turnover,
  source_label = excluded.source_label;
