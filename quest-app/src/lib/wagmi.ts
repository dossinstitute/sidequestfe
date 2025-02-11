import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    bscTestnet,
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'SideQuest',
    projectId: 'f3ca1550e544ed0563061e3880a8aea1',
    chains: [
        bscTestnet,
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    ssr: true,
});