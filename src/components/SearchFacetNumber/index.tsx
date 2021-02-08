import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {
  SearchFacetInputNumberModifier,
  SearchFacetInputNumberProps,
  SearchFacetOperatorType
} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {SEARCH_FACET_OPERATORS} from '../../constants'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import SearchFacet from '../SearchFacet'
import TextInputNumber from '../TextInputNumber'

type Props = {
  facet: SearchFacetInputNumberProps
}

const SearchFacetNumber: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const modifiers = facet?.modifiers
  const selectedModifier = facet?.modifier
    ? modifiers?.find(modifier => modifier.name === facet?.modifier)
    : modifiers?.[0]

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        operatorType
      })
    )
  }

  const handleModifierClick = (modifier: SearchFacetInputNumberModifier) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        modifier: modifier.name
      })
    )
  }

  const handleValueChange = (value: number) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        value
      })
    )
  }

  const selectedOperatorType: SearchFacetOperatorType = facet.operatorType ?? 'greaterThan'

  return (
    <SearchFacet facet={facet}>
      {/* Optional operators */}
      {facet?.operatorTypes && (
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2} //
              text={SEARCH_FACET_OPERATORS[selectedOperatorType].label}
            />
          }
          id="operators"
          menu={
            <Menu>
              {facet.operatorTypes.map((operatorType, index) => {
                if (operatorType) {
                  return (
                    <MenuItem
                      disabled={operatorType === selectedOperatorType}
                      fontSize={1}
                      key={operatorType}
                      onClick={() => handleOperatorItemClick(operatorType)}
                      padding={2}
                      text={SEARCH_FACET_OPERATORS[operatorType].label}
                    />
                  )
                }

                return <MenuDivider key={index} />
              })}
            </Menu>
          }
        />
      )}

      {/* Value */}
      <Box marginX={1} style={{maxWidth: '50px'}}>
        <TextInputNumber
          fontSize={1}
          onValueChange={handleValueChange}
          padding={2}
          radius={2}
          width={2}
          value={facet?.value}
        />
      </Box>

      {/* Modifiers */}
      {modifiers && (
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2} //
              text={selectedModifier?.title}
            />
          }
          id="modifier"
          menu={
            <Menu>
              {modifiers.map(modifier => (
                <MenuItem
                  disabled={modifier.name === facet.modifier}
                  fontSize={1}
                  key={modifier.name}
                  onClick={() => handleModifierClick(modifier)}
                  padding={2}
                  text={modifier.title}
                />
              ))}
            </Menu>
          }
        />
      )}
    </SearchFacet>
  )
}

export default SearchFacetNumber
