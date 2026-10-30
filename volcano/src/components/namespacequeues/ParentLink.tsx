import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { VolcanoNamespaceQueue } from '../../resources/namespacequeue';
import {
  hasNamespaceQueue,
  resolveNamespaceQueueParent,
} from '../../utils/namespaceQueueRelationships';
import { volcanoRouteNames } from '../../utils/volcanoRoutes';

/**
 * Renders a NamespaceQueue parent as a link to its Queue or NamespaceQueue.
 *
 * A NamespaceQueue parent is only linked once it is known to exist, so a dangling reference is
 * shown as plain text instead of a link to an empty page.
 *
 * @param props NamespaceQueue whose `spec.parent` should be rendered, and all known
 * NamespaceQueues (`null` while loading) used to check that a NamespaceQueue parent exists.
 * @returns Link to the parent, the raw value when it cannot be linked, or `-` when unset.
 */
export default function NamespaceQueueParentLink({
  namespaceQueue,
  namespaceQueues,
}: {
  namespaceQueue: VolcanoNamespaceQueue;
  namespaceQueues: VolcanoNamespaceQueue[] | null;
}) {
  const parent = namespaceQueue.spec.parent;
  const parentRef = resolveNamespaceQueueParent(namespaceQueue.getNamespace(), parent);

  if (!parentRef) {
    return <>{parent || '-'}</>;
  }

  if (parentRef.kind === 'queue') {
    return (
      <Link routeName={volcanoRouteNames.queueDetail} params={{ name: parentRef.name }}>
        {parent}
      </Link>
    );
  }

  if (!hasNamespaceQueue(namespaceQueues, parentRef.namespace, parentRef.name)) {
    return <>{parent}</>;
  }

  return (
    <Link
      routeName={volcanoRouteNames.namespaceQueueDetail}
      params={{ namespace: parentRef.namespace, name: parentRef.name }}
    >
      {parent}
    </Link>
  );
}
