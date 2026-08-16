insert into public.company_price_history (
  company_symbol, trade_date, open_price, high_price, low_price, close_price, volume, turnover, source_label
) values
('COMB.N0000', '2026-03-16', 99.68, 103.73, 97.58, 101.20, 140000, 14168000.00, 'Sample data'),
('COMB.N0000', '2026-04-16', 104.90, 109.16, 102.77, 106.50, 158000, 16827000.00, 'Sample data'),
('COMB.N0000', '2026-05-16', 110.12, 114.60, 107.89, 111.80, 176000, 19676800.00, 'Sample data'),
('COMB.N0000', '2026-06-16', 116.53, 121.26, 114.16, 118.30, 194000, 22950200.00, 'Sample data'),
('COMB.N0000', '2026-07-16', 122.83, 127.82, 120.34, 124.70, 212000, 26436400.00, 'Sample data'),
('COMB.N0000', '2026-08-14', 130.51, 135.81, 127.86, 132.50, 230000, 30475000.00, 'Sample data'),
('JKH.N0000', '2026-03-16', 19.50, 20.30, 19.11, 19.80, 149000, 2950200.00, 'Sample data'),
('JKH.N0000', '2026-04-16', 20.29, 21.12, 19.88, 20.60, 167000, 3440200.00, 'Sample data'),
('JKH.N0000', '2026-05-16', 21.08, 21.94, 20.65, 21.40, 185000, 3959000.00, 'Sample data'),
('JKH.N0000', '2026-06-16', 21.87, 22.76, 21.42, 22.20, 203000, 4506600.00, 'Sample data'),
('JKH.N0000', '2026-07-16', 22.75, 23.68, 22.29, 23.10, 221000, 5105100.00, 'Sample data'),
('JKH.N0000', '2026-08-14', 23.44, 24.40, 22.97, 23.80, 239000, 5688200.00, 'Sample data'),
('DIAL.N0000', '2026-03-16', 12.21, 12.71, 11.97, 12.40, 158000, 1959200.00, 'Sample data'),
('DIAL.N0000', '2026-04-16', 11.92, 12.40, 11.68, 12.10, 176000, 2129600.00, 'Sample data'),
('DIAL.N0000', '2026-05-16', 11.62, 12.10, 11.39, 11.80, 194000, 2289200.00, 'Sample data'),
('DIAL.N0000', '2026-06-16', 11.33, 11.79, 11.10, 11.50, 212000, 2438000.00, 'Sample data'),
('DIAL.N0000', '2026-07-16', 11.03, 11.48, 10.81, 11.20, 230000, 2576000.00, 'Sample data'),
('DIAL.N0000', '2026-08-14', 11.23, 11.69, 11.00, 11.40, 248000, 2827200.00, 'Sample data'),
('HAYL.N0000', '2026-03-16', 75.25, 78.31, 73.73, 76.40, 167000, 12758800.00, 'Sample data'),
('HAYL.N0000', '2026-04-16', 79.00, 82.21, 77.39, 80.20, 185000, 14837000.00, 'Sample data'),
('HAYL.N0000', '2026-05-16', 83.43, 86.82, 81.74, 84.70, 203000, 17194100.00, 'Sample data'),
('HAYL.N0000', '2026-06-16', 86.19, 89.69, 84.44, 87.50, 221000, 19337500.00, 'Sample data'),
('HAYL.N0000', '2026-07-16', 88.45, 92.05, 86.66, 89.80, 239000, 21462200.00, 'Sample data'),
('HAYL.N0000', '2026-08-14', 89.83, 93.48, 88.01, 91.20, 257000, 23438400.00, 'Sample data'),
('LOLC.N0000', '2026-03-16', 423.55, 440.75, 414.95, 430.00, 176000, 75680000.00, 'Sample data'),
('LOLC.N0000', '2026-04-16', 455.07, 473.55, 445.83, 462.00, 194000, 89628000.00, 'Sample data'),
('LOLC.N0000', '2026-05-16', 490.53, 510.45, 480.57, 498.00, 212000, 105576000.00, 'Sample data'),
('LOLC.N0000', '2026-06-16', 513.19, 534.03, 502.77, 521.00, 230000, 119830000.00, 'Sample data'),
('LOLC.N0000', '2026-07-16', 527.96, 549.40, 517.24, 536.00, 248000, 132928000.00, 'Sample data'),
('LOLC.N0000', '2026-08-14', 540.52, 562.47, 529.54, 548.75, 266000, 145967500.00, 'Sample data')
on conflict (company_symbol, trade_date) do update set
  open_price = excluded.open_price,
  high_price = excluded.high_price,
  low_price = excluded.low_price,
  close_price = excluded.close_price,
  volume = excluded.volume,
  turnover = excluded.turnover,
  source_label = excluded.source_label;

insert into public.company_financial_history (
  company_symbol, financial_year, revenue, profit_after_tax, eps, nav_per_share, source_label
) values
('COMB.N0000', '2022', 254.10, 24.80, 18.92, 160.40, 'Sample data'),
('COMB.N0000', '2023', 288.60, 29.40, 22.38, 176.20, 'Sample data'),
('COMB.N0000', '2024', 321.80, 33.20, 25.31, 189.70, 'Sample data'),
('COMB.N0000', '2025', 349.20, 36.90, 28.42, 201.30, 'Sample data'),
('JKH.N0000', '2022', 214.50, 13.20, 0.84, 27.10, 'Sample data'),
('JKH.N0000', '2023', 238.90, 17.80, 1.12, 29.40, 'Sample data'),
('JKH.N0000', '2024', 268.30, 20.50, 1.31, 30.60, 'Sample data'),
('JKH.N0000', '2025', 292.70, 22.10, 1.42, 31.80, 'Sample data'),
('DIAL.N0000', '2022', 154.70, 10.40, 1.26, 7.40, 'Sample data'),
('DIAL.N0000', '2023', 171.20, 12.80, 1.52, 8.00, 'Sample data'),
('DIAL.N0000', '2024', 184.60, 13.90, 1.68, 8.30, 'Sample data'),
('DIAL.N0000', '2025', 189.50, 14.30, 1.75, 8.60, 'Sample data'),
('HAYL.N0000', '2022', 398.40, 14.90, 19.84, 139.20, 'Sample data'),
('HAYL.N0000', '2023', 432.70, 16.10, 21.46, 148.50, 'Sample data'),
('HAYL.N0000', '2024', 463.80, 18.20, 24.28, 155.80, 'Sample data'),
('HAYL.N0000', '2025', 487.40, 19.80, 26.41, 162.10, 'Sample data'),
('LOLC.N0000', '2022', 241.90, 30.40, 64.12, 625.80, 'Sample data'),
('LOLC.N0000', '2023', 268.20, 33.80, 71.27, 662.40, 'Sample data'),
('LOLC.N0000', '2024', 291.40, 38.60, 81.43, 694.10, 'Sample data'),
('LOLC.N0000', '2025', 311.60, 41.70, 87.86, 716.40, 'Sample data')
on conflict (company_symbol, financial_year) do update set
  revenue = excluded.revenue,
  profit_after_tax = excluded.profit_after_tax,
  eps = excluded.eps,
  nav_per_share = excluded.nav_per_share,
  source_label = excluded.source_label;

insert into public.company_dividend_history (
  company_symbol, dividend_year, dividend_per_share, dividend_type, source_label
) values
('COMB.N0000', '2022', 6.50, 'Final', 'Sample data'),
('COMB.N0000', '2023', 7.00, 'Final', 'Sample data'),
('COMB.N0000', '2024', 8.00, 'Final', 'Sample data'),
('JKH.N0000', '2023', 0.75, 'Interim', 'Sample data'),
('JKH.N0000', '2024', 0.90, 'Final', 'Sample data'),
('DIAL.N0000', '2022', 1.05, 'Final', 'Sample data'),
('DIAL.N0000', '2023', 1.15, 'Final', 'Sample data'),
('DIAL.N0000', '2024', 1.20, 'Final', 'Sample data'),
('HAYL.N0000', '2023', 4.00, 'Final', 'Sample data'),
('HAYL.N0000', '2024', 4.50, 'Final', 'Sample data')
on conflict (company_symbol, dividend_year, dividend_type) do update set
  dividend_per_share = excluded.dividend_per_share,
  source_label = excluded.source_label;

insert into public.market_index_history (
  index_code, trade_date, close_value, change_percent, source_label
) values
('ASPI', '2026-03-16', 11280.44, 0.40, 'Sample data'),
('ASPI', '2026-04-16', 11642.10, 3.20, 'Sample data'),
('ASPI', '2026-05-16', 11905.73, 2.30, 'Sample data'),
('ASPI', '2026-06-16', 12112.88, 1.70, 'Sample data'),
('ASPI', '2026-07-16', 12340.51, 1.90, 'Sample data'),
('ASPI', '2026-08-14', 12486.42, 1.20, 'Sample data'),
('SPSL20', '2026-03-16', 3384.18, 0.20, 'Sample data'),
('SPSL20', '2026-04-16', 3476.80, 2.70, 'Sample data'),
('SPSL20', '2026-05-16', 3552.34, 2.20, 'Sample data'),
('SPSL20', '2026-06-16', 3630.48, 2.20, 'Sample data'),
('SPSL20', '2026-07-16', 3689.20, 1.60, 'Sample data'),
('SPSL20', '2026-08-14', 3721.09, 0.90, 'Sample data')
on conflict (index_code, trade_date) do update set
  close_value = excluded.close_value,
  change_percent = excluded.change_percent,
  source_label = excluded.source_label;

insert into public.sector_summaries (
  sector_name, summary_date, turnover, volume, market_cap_label, change_percent, companies_count, source_label
) values
('Banking', '2026-08-14', 820.00, 5800000, 'Large', 1.80, 12, 'Sample data'),
('Diversified Holdings', '2026-08-14', 740.00, 4200000, 'Large', 1.10, 18, 'Sample data'),
('Telecommunication', '2026-08-14', 310.00, 3900000, 'Large', -0.40, 3, 'Sample data'),
('Financial Services', '2026-08-14', 520.00, 2100000, 'Large', 0.90, 21, 'Sample data')
on conflict (sector_name, summary_date) do update set
  turnover = excluded.turnover,
  volume = excluded.volume,
  market_cap_label = excluded.market_cap_label,
  change_percent = excluded.change_percent,
  companies_count = excluded.companies_count,
  source_label = excluded.source_label;

insert into public.company_factor_snapshots (
  company_symbol,
  snapshot_date,
  revenue_trend,
  profit_trend,
  dividend_status,
  price_history_note,
  announcement_note,
  liquidity_note,
  strengths,
  concerns,
  data_gaps,
  source_label
) values
('COMB.N0000', '2026-08-14', 'Revenue increased across the sample history period.', 'Profit after tax was higher in each sample year.', 'Sample dividend history is available for recent years.', 'Closing prices moved higher across the sample period.', 'Recent sample updates include financial reports and dividend notices.', 'Sample volume indicates regular market activity.', array['Multi-year revenue growth in sample data', 'Recent dividend history is available'], array['Banking results can be affected by credit conditions and interest rates'], array['Cash flow and capital adequacy details are not included yet'], 'Sample data'),
('JKH.N0000', '2026-08-14', 'Revenue increased across the sample history period.', 'Profit improved in the sample financial history.', 'Some sample dividend entries are available.', 'Closing prices moved gradually higher in the sample period.', 'Recent sample updates include financial reports and corporate disclosures.', 'Sample volume indicates regular market activity.', array['Diversified business exposure', 'Improving sample earnings trend'], array['Group results can vary by sector and capital project cycle'], array['Segment-level cash flow data is not included yet'], 'Sample data'),
('DIAL.N0000', '2026-08-14', 'Revenue increased in the sample history period.', 'Profit was relatively stable in the sample financial history.', 'Sample dividend history is available for recent years.', 'Closing prices were mixed across the sample period.', 'Recent sample updates include financial reports and network investment notes.', 'Sample volume indicates regular market activity.', array['Recurring communication-service revenue in sample data'], array['Technology investment needs can affect cash flow'], array['Debt maturity details are not included yet'], 'Sample data'),
('HAYL.N0000', '2026-08-14', 'Revenue increased across the sample history period.', 'Profit improved in the sample financial history.', 'Recent sample dividend entries are available.', 'Closing prices moved higher across the sample period.', 'Recent sample updates include annual report and dividend summaries.', 'Sample volume indicates regular market activity.', array['Diversified export and industrial exposure in sample data'], array['Export and input-cost changes can affect margins'], array['Segment-level margin data is not included yet'], 'Sample data'),
('LOLC.N0000', '2026-08-14', 'Revenue increased across the sample history period.', 'Profit after tax increased in the sample financial history.', 'No recent sample dividend entry is included in this seed.', 'Closing prices moved higher across the sample period.', 'Recent sample updates include interim reports and corporate disclosures.', 'Sample volume indicates regular market activity.', array['Profit trend improved in sample data'], array['Financial services results can vary with credit and currency conditions'], array['Geographic split and credit-quality data are not included yet'], 'Sample data')
on conflict (company_symbol, snapshot_date) do update set
  revenue_trend = excluded.revenue_trend,
  profit_trend = excluded.profit_trend,
  dividend_status = excluded.dividend_status,
  price_history_note = excluded.price_history_note,
  announcement_note = excluded.announcement_note,
  liquidity_note = excluded.liquidity_note,
  strengths = excluded.strengths,
  concerns = excluded.concerns,
  data_gaps = excluded.data_gaps,
  source_label = excluded.source_label;
