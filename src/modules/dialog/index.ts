import produce from 'immer'
import {ofType} from 'redux-observable'
import {of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'

import {AssetsActionTypes} from '../assets'
import {DialogActions, DialogReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DialogActionTypes {
  CLEAR = 'DIALOG_CLEAR',
  REMOVE = 'DIALOG_REMOVE',
  SHOW_DELETE_CONFIRM = 'DIALOG_SHOW_DELETE_CONFIRM',
  SHOW_DETAILS = 'DIALOG_SHOW_DETAILS',
  SHOW_SEARCH_FACETS = 'DIALOG_SHOW_SEARCH_FACETS'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = {
  items: []
}

export default function dialogReducer(
  state: DialogReducerState = INITIAL_STATE,
  action: DialogActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case DialogActionTypes.CLEAR:
        draft.items = []
        break
      case DialogActionTypes.REMOVE: {
        const id = action.payload?.id
        draft.items = draft.items.filter(item => item.id !== id)
        break
      }
      case DialogActionTypes.SHOW_DETAILS: {
        const {assetId} = action.payload
        draft.items.push({
          assetId,
          id: 'details',
          type: 'details'
        })
        break
      }
      case DialogActionTypes.SHOW_DELETE_CONFIRM: {
        const {assetId, options} = action.payload
        draft.items.push({
          assetId,
          closeDialogId: options?.closeDialogId,
          id: 'deleteConfirm',
          type: 'deleteConfirm'
        })
        break
      }
      case DialogActionTypes.SHOW_SEARCH_FACETS:
        draft.items.push({
          id: 'searchFacets',
          type: 'searchFacets'
        })
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/**
 * Clear all dialogs
 */

export const dialogClear = () => ({
  payload: {
    asset: undefined
  },
  type: DialogActionTypes.CLEAR
})

/**
 * Clear dialog with ID
 */

export const dialogRemove = (id: string) => ({
  payload: {
    id
  },
  type: DialogActionTypes.REMOVE
})

/**
 * Display asset delete confirmation
 */

export const dialogShowDeleteConfirm = (
  assetId?: string,
  options?: {
    closeDialogId?: string
  }
) => ({
  payload: {
    assetId,
    options
  },
  type: DialogActionTypes.SHOW_DELETE_CONFIRM
})

/**
 * Display asset details
 */

export const dialogShowDetails = (assetId: string) => ({
  payload: {
    assetId
  },
  type: DialogActionTypes.SHOW_DETAILS
})

/**
 * Display search facets
 */

export const dialogShowSearchFacets = () => ({
  type: DialogActionTypes.SHOW_SEARCH_FACETS
})

/*********
 * EPICS *
 *********/

/**
 * Listen for successful asset updates / deletes:
 * - Clear dialog if a dialog ID has been passed
 */
export const dialogClearOnAssetUpdateEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_COMPLETE, AssetsActionTypes.UPDATE_COMPLETE),
    filter(action => action?.payload?.options?.closeDialogId),
    mergeMap(action => {
      const dialogId = action?.payload?.options?.closeDialogId
      return of(dialogRemove(dialogId))
    })
  )
