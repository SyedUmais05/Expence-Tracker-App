import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
