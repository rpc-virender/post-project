import React from 'react'
import { PopupCrossMark } from '../images/commonSvgs';

export default function SimpleSuccessPopup({onFunction, contant, note, boxId}) {
  return (
        <div id={boxId} className="imagesPopupinnerPopupCon csvPopupInnerPopupCon csvPopupSuccessCon">
            <div className='csvPopupSuccessTopCon'>
                <PopupCrossMark id="csvPopupSuccessCrossIcon" key="csvPopupSuccessCrossIcon" className="csvPopupSuccessCrossIcon" onClick={()=>onFunction("close")} />
            </div>

            <div className='csvPopupSuccessBottomCon'>
                <svg className='csvPopupSuccessSvg' xmlns="http://www.w3.org/2000/svg" width="127" height="127" viewBox="0 0 127 127" fill="none">
                    <circle cx="63.5" cy="63.5" r="63" fill="white" stroke="#148B16"/>
                    <path d="M88.9199 34.5373C87.8709 33.9526 86.7173 33.5807 85.5248 33.443C84.3323 33.3053 83.1244 33.4044 81.9702 33.7347C80.816 34.065 79.7382 34.62 78.7982 35.368C77.8583 36.1159 77.0748 37.0422 76.4924 38.0937L59.5281 68.6782L49.8191 58.9518C48.9762 58.0775 47.9679 57.3801 46.853 56.9003C45.7382 56.4205 44.5391 56.168 43.3258 56.1574C42.1125 56.1469 40.9092 56.3785 39.7862 56.8388C38.6632 57.2991 37.643 57.9788 36.785 58.8383C35.927 59.6979 35.2485 60.7199 34.789 61.845C34.3296 62.97 34.0984 64.1754 34.1089 65.3909C34.1195 66.6064 34.3715 67.8077 34.8505 68.9245C35.3294 70.0414 36.0255 71.0515 36.8982 71.896L55.1739 90.2046C56.9009 91.9393 59.2311 92.8914 61.6343 92.8914L62.8999 92.7998C64.3005 92.6036 65.6365 92.0843 66.8028 91.2829C67.969 90.4815 68.9337 89.4198 69.6208 88.1815L92.4653 46.9871C93.0486 45.9364 93.4195 44.781 93.557 43.5867C93.6945 42.3924 93.5958 41.1826 93.2665 40.0265C92.9373 38.8705 92.384 37.7907 91.6382 36.8488C90.8924 35.907 89.9687 35.1215 88.9199 34.5373Z" fill="#148B16"/>
                </svg>

                <h2 className='csvPopupSuccessHeading'>Success!</h2>
                <p className='csvPopupSuccessText'>{contant}</p>
                {note && <p className='csvPopupSuccessNote'>{note}</p>}
            </div>
        </div>
  )
}
