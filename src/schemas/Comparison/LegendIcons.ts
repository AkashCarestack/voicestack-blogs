export interface LegendIcon {
  name: string
  title: string
  svg: string
}

export const legendIcons: Record<string, LegendIcon> = {
  cross: {
    name: 'cross',
    title: 'Cross',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21" height="21" width="21">
<path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#FB2C36" d="M5.6665 15.8169L15.6665 5.81689M5.6665 5.81689L15.6665 15.8169"></path>
</svg>`,
  },
  tick: {
    name: 'tick',
    title: 'Tick',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21" height="21" width="20">
<path fill="#008236" d="M16.7038 4.96895C16.7824 5.02858 16.8484 5.10311 16.8981 5.18828C16.9478 5.27345 16.9802 5.36758 16.9935 5.46529C17.0068 5.56301 17.0007 5.66238 16.9755 5.75773C16.9503 5.85308 16.9066 5.94252 16.8468 6.02095L8.84685 16.521C8.78195 16.606 8.69962 16.6762 8.60536 16.7268C8.51111 16.7774 8.40712 16.8073 8.30038 16.8144C8.19363 16.8215 8.0866 16.8057 7.98647 16.768C7.88635 16.7303 7.79544 16.6717 7.71985 16.596L3.21985 12.096C3.08737 11.9538 3.01524 11.7657 3.01867 11.5714C3.0221 11.3771 3.10081 11.1917 3.23822 11.0543C3.37564 10.9169 3.56102 10.8382 3.75532 10.8348C3.94963 10.8313 4.13767 10.9035 4.27985 11.036L8.17385 14.929L15.6538 5.11195C15.7742 4.9539 15.9524 4.85008 16.1493 4.82327C16.3461 4.79646 16.5456 4.84885 16.7038 4.96895Z" clip-rule="evenodd" fill-rule="evenodd"></path>
</svg>`,
  },
  warning: {
    name: 'warning',
    title: 'Warning',
    svg: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.95118 2.35059C7.52818 1.35059 8.97118 1.35059 9.54918 2.35059L14.7452 11.3506C14.8768 11.5786 14.9461 11.8373 14.9461 12.1006C14.9461 12.3639 14.8768 12.6225 14.7452 12.8506C14.6135 13.0786 14.4242 13.268 14.1962 13.3996C13.9681 13.5313 13.7095 13.6006 13.4462 13.6006H3.05418C2.7908 13.6008 2.53201 13.5316 2.30385 13.4C2.07568 13.2684 1.88619 13.0791 1.75442 12.851C1.62266 12.6229 1.55326 12.3642 1.55322 12.1008C1.55318 11.8374 1.62249 11.5787 1.75418 11.3506L6.95118 2.35059ZM8.25018 4.10059C8.4491 4.10059 8.63986 4.1796 8.78051 4.32026C8.92117 4.46091 9.00018 4.65167 9.00018 4.85059V7.85059C9.00018 8.0495 8.92117 8.24026 8.78051 8.38092C8.63986 8.52157 8.4491 8.60059 8.25018 8.60059C8.05127 8.60059 7.86051 8.52157 7.71985 8.38092C7.5792 8.24026 7.50018 8.0495 7.50018 7.85059V4.85059C7.50018 4.65167 7.5792 4.46091 7.71985 4.32026C7.86051 4.1796 8.05127 4.10059 8.25018 4.10059ZM8.25018 12.1006C8.5154 12.1006 8.76975 11.9952 8.95729 11.8077C9.14483 11.6202 9.25018 11.3658 9.25018 11.1006C9.25018 10.8354 9.14483 10.581 8.95729 10.3935C8.76975 10.2059 8.5154 10.1006 8.25018 10.1006C7.98497 10.1006 7.73061 10.2059 7.54308 10.3935C7.35554 10.581 7.25018 10.8354 7.25018 11.1006C7.25018 11.3658 7.35554 11.6202 7.54308 11.8077C7.73061 11.9952 7.98497 12.1006 8.25018 12.1006Z" fill="#6B7280"></path>
</svg>`,
  },
  intermediate: {
    name: 'intermediate',
    title: 'Intermediate',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21" height="21" width="20">
<path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#6A7282" d="M3.125 6.44141H16.875M6.125 10.8164H14M3.125 15.1914H16.875"></path>
</svg>
`,
  },
  basic: {
    name: 'basic',
    title: 'Basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21" height="21" width="20">
<circle stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#6A7282" r="8" cy="10.8164" cx="10"></circle>
<path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#6A7282" d="M10 6.81641V10.7227M10 13.8477H10.0073V13.856H10V13.8477Z"></path>
</svg>`,
  },
}

export const getLegendIcon = (iconName: string): LegendIcon | undefined => {
  return legendIcons[iconName]
}

export const getLegendIconList = (): Array<{ title: string; value: string }> => {
  return Object.values(legendIcons).map((icon) => ({
    title: icon.title,
    value: icon.name,
  }))
}

