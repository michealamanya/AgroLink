export function getRoleWorkspace(role, farmers, reports, advisories, inventory) {
  if (role === 'farmer') {
    return {
      spotlight: reports.slice(0, 3),
      secondary: advisories.slice(0, 3),
      tertiary: inventory.filter((entry) => entry.status === 'Verified').slice(0, 3),
      spotlightTitle: 'Recent field issues',
      secondaryTitle: 'Latest advisories',
      tertiaryTitle: 'Verified inputs nearby',
    }
  }

  if (role === 'extension') {
    return {
      spotlight: reports.slice(0, 4),
      secondary: farmers.slice(0, 4),
      tertiary: advisories.slice(0, 3),
      spotlightTitle: 'Active response queue',
      secondaryTitle: 'Recently profiled farmers',
      tertiaryTitle: 'Published guidance',
    }
  }

  if (role === 'dealer') {
    return {
      spotlight: inventory.slice(0, 4),
      secondary: reports.slice(0, 3),
      tertiary: advisories.slice(0, 3),
      spotlightTitle: 'Current stock board',
      secondaryTitle: 'Farmer issues affecting demand',
      tertiaryTitle: 'Extension advisories to watch',
    }
  }

  return {
    spotlight: reports.slice(0, 4),
    secondary: advisories.slice(0, 4),
    tertiary: inventory.slice(0, 4),
    spotlightTitle: 'District incident monitor',
    secondaryTitle: 'District knowledge feed',
    tertiaryTitle: 'Supply visibility board',
  }
}
