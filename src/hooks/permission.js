import { Platform } from 'react-native';
import {
    checkMultiple,
    requestMultiple,
    openSettings,
    RESULTS,
} from 'react-native-permissions';
import { PLATFORM_PERMISSIONS } from '@/constants';
import { useEffect,useState } from 'react';

export const usePermission = () => {

    const permissions = PLATFORM_PERMISSIONS[Platform.OS];
    const [blockedAny, setBlockedAny] = useState(null);

    useEffect(() => {
        let notGranted = [];
        checkMultiple(permissions).then(
            (statuses) => {
                permissions.map((p) => {
                    const status = statuses[p];
                    if (status === RESULTS.BLOCKED) {
                        setBlockedAny(true);
                    } else if (status !== RESULTS.GRANTED) {
                        notGranted.push(p);
                    }
                });
                notGranted.length && requestMultiple(notGranted);
                // blockedAny && openSettings();
            }
        );
    }, [])
    return  { blockedAny }
}