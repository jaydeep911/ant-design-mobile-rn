import classNames from 'classnames'
import React, { forwardRef, memo, useContext, useMemo, useRef } from 'react'
import { Text, TouchableHighlight } from 'react-native'
import DisabledContext from '../config-provider/DisabledContext'
import List from '../list/index'
import { WithTheme } from '../style'
import Checkbox from './Checkbox'
import { CheckboxForwardedRef, CheckboxItemProps } from './PropsType'
import checkboxStyles from './style/index'

const CheckboxItem = forwardRef<TouchableHighlight, CheckboxItemProps>(
  (props, ref) => {
    const contextDisabled = useContext(DisabledContext)
    const {
      style,
      prefixCls = 'checkbox',
      disabled = contextDisabled,
      children,
      right,
      left = !right,
      ...restProps
    } = props
    const checkbox = useRef<CheckboxForwardedRef>(null)

    // for accessibility
    const [innerChecked, setInnerChecked] = React.useState<boolean>(
      props.checked ?? props.defaultChecked ?? false,
    )

    const handleClick = () => {
      if (checkbox.current) {
        checkbox.current.onPress()
      }
      props.onPress?.()
    }

    const thumbNode = (
      <Checkbox
        {...restProps}
        prefixCls={prefixCls}
        disabled={disabled}
        onChange={({ target: { checked } }) => {
          setInnerChecked(checked)
        }}
        ref={checkbox}
      />
    )
    const listProps = {
      ...restProps,
      thumb: left && !right ? thumbNode : undefined,
      extra: right ? thumbNode : undefined,
    }

    const contentDom = useMemo(() => {
      if (React.isValidElement(children)) {
        return children
      }
      if (typeof children === 'string') {
        return (
          <WithTheme themeStyles={checkboxStyles} styles={props.styles}>
            {(styles) => {
              const antd_checlbox_label = classNames(`${prefixCls}_label`, {
                [`${prefixCls}_label_disabled`]: disabled,
              })
                .split(' ')
                .map((a) => styles[a])

              return (
                <Text style={antd_checlbox_label} numberOfLines={1}>
                  {children}
                </Text>
              )
            }}
          </WithTheme>
        )
      }
    }, [children, disabled, prefixCls, props.styles])

    return (
      <List.Item
        ref={ref}
        style={style}
        disabled={disabled}
        onPress={handleClick}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: props.indeterminate ? 'mixed' : innerChecked,
          disabled,
        }}
        {...listProps}>
        {contentDom}
      </List.Item>
    )
  },
)

export default memo(CheckboxItem)
