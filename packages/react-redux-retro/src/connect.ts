import {
  connect,
  MapStateToPropsParam
} from 'react-redux';

interface MapActionsToPropsFunction<TActionProps, TOwnProps> {
  (actions: any, ownProps?: TOwnProps): TActionProps;
}

export default <TStateProps = {}, TActionProps = {}, TOwnProps = {},
TMergedProps = {}, State = {}>(
  mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State> | null,
  mapActionsToProps: MapActionsToPropsFunction<TActionProps, TOwnProps> | null,
  component: React.ComponentClass<TStateProps & TActionProps> |
    React.FC<TStateProps & TActionProps>,
  options?: object
) => {
  const mapDispatchToProps = (dispatch: any) => {
    if (mapActionsToProps) {
      return mapActionsToProps(dispatch.actions);
    }
    return {};
  }
  return connect(mapStateToProps, mapDispatchToProps, null as any, options as any)(component as any);
};
