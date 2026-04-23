/**
 * teamFlags.js — Shared Team Flag Utilities
 * Maps team names to ISO country codes for flagcdn.com
 */

export const TEAM_FLAGS = {
  Argentina: "ar", Brazil: "br", France: "fr", England: "gb-eng",
  Spain: "es", Germany: "de", Portugal: "pt", Netherlands: "nl",
  Italy: "it", Croatia: "hr", Uruguay: "uy", Morocco: "ma",
  USA: "us", Colombia: "co", Mexico: "mx", Switzerland: "ch",
  Senegal: "sn", Japan: "jp", Denmark: "dk", Iran: "ir",
  "South Korea": "kr", Australia: "au", Ukraine: "ua", Austria: "at",
  Sweden: "se", Serbia: "rs", Poland: "pl", Peru: "pe",
  Scotland: "gb-sct", Wales: "gb-wls", Ecuador: "ec", Cameroon: "cm",
  Hungary: "hu", Canada: "ca", Chile: "cl", Egypt: "eg",
  Nigeria: "ng", Mali: "ml", "Ivory Coast": "ci", Algeria: "dz",
  "Saudi Arabia": "sa", Qatar: "qa", Norway: "no",
  Czechia: "cz", Slovakia: "sk", Romania: "ro", Paraguay: "py",
  "Costa Rica": "cr", Tunisia: "tn", Ghana: "gh", Bolivia: "bo",
  "Curaçao": "cw", Haiti: "ht", "New Zealand": "nz",
  "Bosnia and Herzegovina": "ba", "Cabo Verde": "cv",
  "Congo DR": "cd", Uzbekistan: "uz", Jordan: "jo",
  Türkiye: "tr", "South Africa": "za", Iraq: "iq",
  Belgium: "be", Panama: "pa",
};

/**
 * Get a team's flag URL from flagcdn.com
 * @param {string} name - Team name
 * @param {number} size - Width in pixels (default 40)
 * @returns {string} Flag image URL
 */
export function getTeamFlag(name, size = 40) {
  const code = TEAM_FLAGS[name] || "xx";
  return `https://flagcdn.com/w${size}/${code}.png`;
}

/**
 * Get short team name (3-letter code)
 * @param {string} name - Full team name
 * @returns {string} Short team code
 */
export function getShortTeamName(name) {
  const shortNames = {
    Argentina: "ARG", Brazil: "BRA", France: "FRA", England: "ENG",
    Spain: "ESP", Germany: "GER", Portugal: "POR", Netherlands: "NED",
    Italy: "ITA", Croatia: "CRO", Uruguay: "URU", Morocco: "MAR",
    USA: "USA", Colombia: "COL", Mexico: "MEX", Switzerland: "SUI",
    Senegal: "SEN", Japan: "JPN", Denmark: "DEN", Iran: "IRN",
    "South Korea": "KOR", Australia: "AUS", Ukraine: "UKR", Austria: "AUT",
    Sweden: "SWE", Serbia: "SRB", Poland: "POL", Peru: "PER",
    Scotland: "SCO", Wales: "WAL", Ecuador: "ECU", Cameroon: "CMR",
    Hungary: "HUN", Canada: "CAN", Chile: "CHI", Egypt: "EGY",
    Nigeria: "NGA", Mali: "MLI", "Ivory Coast": "CIV", Algeria: "ALG",
    "Saudi Arabia": "KSA", Qatar: "QAT", Norway: "NOR",
    Czechia: "CZE", Slovakia: "SVK", Romania: "ROU", Paraguay: "PAR",
    "Costa Rica": "CRC", Tunisia: "TUN", Ghana: "GHA", Bolivia: "BOL",
    "Curaçao": "CUR", Haiti: "HAI", "New Zealand": "NZL",
    "Bosnia and Herzegovina": "BIH", "Cabo Verde": "CPV",
    "Congo DR": "COD", Uzbekistan: "UZB", Jordan: "JOR",
    Türkiye: "TUR", "South Africa": "RSA", Iraq: "IRQ",
    Belgium: "BEL", Panama: "PAN",
  };
  return shortNames[name] || (name ? name.slice(0, 3).toUpperCase() : "");
}

/**
 * Handle flag image error with fallback
 * @param {Event} e - Error event
 */
export function handleFlagError(e) {
  e.target.src = "https://flagcdn.com/w40/xx.png";
}