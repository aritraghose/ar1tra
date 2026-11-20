// Approximate locations of Cloudflare data centers, keyed by the IATA code that
// request.cf.colo reports. Used only to estimate distance; codes missing here
// simply render without a city or distance.
const RAW = `
DAC Dhaka 23.84 90.40|CGP Chattogram 22.25 91.81|CCU Kolkata 22.65 88.45|DEL New Delhi 28.56 77.10
BOM Mumbai 19.09 72.87|MAA Chennai 12.99 80.17|BLR Bengaluru 13.20 77.71|HYD Hyderabad 17.24 78.43
AMD Ahmedabad 23.07 72.63|COK Kochi 10.15 76.40|KTM Kathmandu 27.70 85.36|CMB Colombo 7.18 79.88
KHI Karachi 24.91 67.16|LHE Lahore 31.52 74.40|ISB Islamabad 33.55 72.83|RGN Yangon 16.91 96.13
SIN Singapore 1.36 103.99|KUL Kuala Lumpur 2.75 101.71|BKK Bangkok 13.69 100.75|CGK Jakarta -6.13 106.66
MNL Manila 14.51 121.02|SGN Ho Chi Minh City 10.82 106.66|HAN Hanoi 21.22 105.81|PNH Phnom Penh 11.55 104.84
HKG Hong Kong 22.31 113.91|TPE Taipei 25.08 121.23|NRT Tokyo 35.77 140.39|KIX Osaka 34.43 135.24
ICN Seoul 37.46 126.44|SYD Sydney -33.95 151.18|MEL Melbourne -37.67 144.84|BNE Brisbane -27.38 153.12
PER Perth -31.94 115.97|ADL Adelaide -34.95 138.53|AKL Auckland -37.01 174.79|CHC Christchurch -43.49 172.53
DXB Dubai 25.25 55.36|DOH Doha 25.27 51.61|BAH Manama 26.27 50.63|KWI Kuwait City 29.24 47.97
RUH Riyadh 24.96 46.70|JED Jeddah 21.68 39.16|MCT Muscat 23.59 58.28|TLV Tel Aviv 32.01 34.89
AMM Amman 31.72 35.99|IST Istanbul 41.26 28.74|LHR London 51.47 -0.45|MAN Manchester 53.35 -2.27
EDI Edinburgh 55.95 -3.37|DUB Dublin 53.42 -6.27|AMS Amsterdam 52.31 4.76|BRU Brussels 50.90 4.48
FRA Frankfurt 50.03 8.57|MUC Munich 48.35 11.79|DUS Düsseldorf 51.29 6.77|HAM Hamburg 53.63 9.99
TXL Berlin 52.56 13.29|CDG Paris 49.01 2.55|MRS Marseille 43.44 5.22|MAD Madrid 40.47 -3.56
BCN Barcelona 41.30 2.08|LIS Lisbon 38.77 -9.13|MXP Milan 45.63 8.72|FCO Rome 41.80 12.25
ZRH Zurich 47.46 8.55|GVA Geneva 46.24 6.11|VIE Vienna 48.11 16.57|PRG Prague 50.10 14.26
WAW Warsaw 52.17 20.97|BUD Budapest 47.44 19.26|CPH Copenhagen 55.62 12.65|ARN Stockholm 59.65 17.92
OSL Oslo 60.19 11.10|HEL Helsinki 60.32 24.95|TLL Tallinn 59.41 24.83|RIX Riga 56.92 23.97
VNO Vilnius 54.63 25.29|ATH Athens 37.94 23.94|SOF Sofia 42.70 23.41|OTP Bucharest 44.57 26.10
KBP Kyiv 50.35 30.89|CAI Cairo 30.12 31.41|CMN Casablanca 33.37 -7.59|LOS Lagos 6.58 3.32
ACC Accra 5.61 -0.17|NBO Nairobi -1.32 36.93|MBA Mombasa -4.03 39.59|DAR Dar es Salaam -6.88 39.20
KGL Kigali -1.97 30.14|JNB Johannesburg -26.14 28.25|CPT Cape Town -33.97 18.60|IAD Ashburn 38.95 -77.46
EWR Newark 40.69 -74.17|BOS Boston 42.36 -71.01|PHL Philadelphia 39.87 -75.24|PIT Pittsburgh 40.49 -80.23
ATL Atlanta 33.64 -84.43|CLT Charlotte 35.21 -80.94|MIA Miami 25.80 -80.29|TPA Tampa 27.98 -82.53
ORD Chicago 41.98 -87.90|DTW Detroit 42.21 -83.35|MSP Minneapolis 44.88 -93.22|STL St. Louis 38.75 -90.37
MCI Kansas City 39.30 -94.71|BNA Nashville 36.12 -86.68|DFW Dallas 32.90 -97.04|IAH Houston 29.99 -95.34
DEN Denver 39.86 -104.67|PHX Phoenix 33.43 -112.01|SLC Salt Lake City 40.79 -111.98|LAS Las Vegas 36.08 -115.15
LAX Los Angeles 33.94 -118.41|SAN San Diego 32.73 -117.19|SJC San Jose 37.36 -121.93|SMF Sacramento 38.70 -121.59
PDX Portland 45.59 -122.60|SEA Seattle 47.45 -122.31|HNL Honolulu 21.32 -157.92|YYZ Toronto 43.68 -79.63
YUL Montréal 45.47 -73.74|YVR Vancouver 49.19 -123.18|YYC Calgary 51.13 -114.01|MEX Mexico City 19.44 -99.07
QRO Querétaro 20.62 -100.19|PTY Panama City 9.07 -79.38|BOG Bogotá 4.70 -74.15|UIO Quito -0.13 -78.36
LIM Lima -12.02 -77.11|SCL Santiago -33.39 -70.79|EZE Buenos Aires -34.82 -58.54|GRU São Paulo -23.43 -46.47
GIG Rio de Janeiro -22.81 -43.25|FOR Fortaleza -3.78 -38.53|POA Porto Alegre -29.99 -51.17|CWB Curitiba -25.53 -49.18
`;

export interface Colo {
	city: string;
	lat: number;
	lon: number;
}

export const COLOS: Record<string, Colo> = Object.fromEntries(
	RAW.split(/[|\n]/)
		.map((s) => s.trim())
		.filter(Boolean)
		.map((entry) => {
			const [code, city, lat, lon] = entry.split(" ");
			return [code, { city: city.replace(/ /g, " "), lat: Number(lat), lon: Number(lon) }];
		}),
);

/** Great-circle distance in km. */
export function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
	const rad = Math.PI / 180;
	const dLat = (bLat - aLat) * rad;
	const dLon = (bLon - aLon) * rad;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
	return 2 * 6371 * Math.asin(Math.sqrt(h));
}
