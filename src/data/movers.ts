import type { TopMover } from '@/types/movers';

export const topMovers: TopMover[] = [
  { id: 'gainer-comb', moverDate: '2026-08-14', companySymbol: 'COMB.N0000', companyName: 'Commercial Bank of Ceylon PLC', movementType: 'gainer', changePercent: 3.2, tradedVolume: 230000, turnover: 30475000, sourceLabel: 'Sample data' },
  { id: 'gainer-jkh', moverDate: '2026-08-14', companySymbol: 'JKH.N0000', companyName: 'John Keells Holdings PLC', movementType: 'gainer', changePercent: 2.4, tradedVolume: 239000, turnover: 5688200, sourceLabel: 'Sample data' },
  { id: 'gainer-hayl', moverDate: '2026-08-14', companySymbol: 'HAYL.N0000', companyName: 'Hayleys PLC', movementType: 'gainer', changePercent: 1.8, tradedVolume: 257000, turnover: 23438400, sourceLabel: 'Sample data' },
  { id: 'gainer-lolc', moverDate: '2026-08-14', companySymbol: 'LOLC.N0000', companyName: 'LOLC Holdings PLC', movementType: 'gainer', changePercent: 1.6, tradedVolume: 266000, turnover: 145967500, sourceLabel: 'Sample data' },
  { id: 'gainer-dial', moverDate: '2026-08-14', companySymbol: 'DIAL.N0000', companyName: 'Dialog Axiata PLC', movementType: 'gainer', changePercent: 0.7, tradedVolume: 248000, turnover: 2827200, sourceLabel: 'Sample data' },
  { id: 'loser-dial', moverDate: '2026-08-14', companySymbol: 'DIAL.N0000', companyName: 'Dialog Axiata PLC', movementType: 'loser', changePercent: -1.4, tradedVolume: 248000, turnover: 2827200, sourceLabel: 'Sample data' },
  { id: 'loser-jkh', moverDate: '2026-08-14', companySymbol: 'JKH.N0000', companyName: 'John Keells Holdings PLC', movementType: 'loser', changePercent: -0.8, tradedVolume: 239000, turnover: 5688200, sourceLabel: 'Sample data' },
  { id: 'loser-hayl', moverDate: '2026-08-14', companySymbol: 'HAYL.N0000', companyName: 'Hayleys PLC', movementType: 'loser', changePercent: -0.6, tradedVolume: 257000, turnover: 23438400, sourceLabel: 'Sample data' },
  { id: 'loser-comb', moverDate: '2026-08-14', companySymbol: 'COMB.N0000', companyName: 'Commercial Bank of Ceylon PLC', movementType: 'loser', changePercent: -0.4, tradedVolume: 230000, turnover: 30475000, sourceLabel: 'Sample data' },
  { id: 'loser-lolc', moverDate: '2026-08-14', companySymbol: 'LOLC.N0000', companyName: 'LOLC Holdings PLC', movementType: 'loser', changePercent: -0.2, tradedVolume: 266000, turnover: 145967500, sourceLabel: 'Sample data' },
  { id: 'traded-lolc', moverDate: '2026-08-14', companySymbol: 'LOLC.N0000', companyName: 'LOLC Holdings PLC', movementType: 'most_traded', tradedVolume: 266000, turnover: 145967500, sourceLabel: 'Sample data' },
  { id: 'traded-comb', moverDate: '2026-08-14', companySymbol: 'COMB.N0000', companyName: 'Commercial Bank of Ceylon PLC', movementType: 'most_traded', tradedVolume: 230000, turnover: 30475000, sourceLabel: 'Sample data' },
  { id: 'traded-hayl', moverDate: '2026-08-14', companySymbol: 'HAYL.N0000', companyName: 'Hayleys PLC', movementType: 'most_traded', tradedVolume: 257000, turnover: 23438400, sourceLabel: 'Sample data' },
  { id: 'traded-jkh', moverDate: '2026-08-14', companySymbol: 'JKH.N0000', companyName: 'John Keells Holdings PLC', movementType: 'most_traded', tradedVolume: 239000, turnover: 5688200, sourceLabel: 'Sample data' },
  { id: 'traded-dial', moverDate: '2026-08-14', companySymbol: 'DIAL.N0000', companyName: 'Dialog Axiata PLC', movementType: 'most_traded', tradedVolume: 248000, turnover: 2827200, sourceLabel: 'Sample data' },
];
