import React from 'react';
import './styles.css';

// version: 0.02 - 04/29/2021

type BaseProps = {
  children?: React.ReactElement[] | React.ReactElement | string;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  style?: object;
};

/* <QuestionMark /> */
export const QuestionMark = (props: BaseProps) => (
  <svg
    x="0px"
    y="0px"
    width="92px"
    height="92px"
    viewBox="0 0 92 92"
    enable-background="new 0 0 92 92"
    onClick={props.onClick}
    className={props.className || ''}
  >
    <path
      id="XMLID_1489_"
      d="M60.9,25.5c3.2,3.6,4.7,8.5,4,13.7c-1.2,9.6-8.2,13-14.4,13c-0.3,0-0.5,0-0.5,0v2.4c0,2.2-1.8,4-4,4
	s-4-1.8-4-4v-3.2c0-3.3,1.4-7.2,8.5-7.2c3.9,0,5.9-2,6.4-6c0.2-1.3,0.3-4.8-2.1-7.4c-1.9-2.1-5-3.2-9.2-3.2c-9,0-9.3,5.9-9.3,6.5
	c0,2.2-1.8,4-4,4s-4-1.8-4-4c0-4,3.1-14.5,17.3-14.5C53.9,19.6,58.5,22.8,60.9,25.5z M45.7,62c-1.3,0-2.6,0.5-3.5,1.5
	c-0.9,0.9-1.5,2.2-1.5,3.5c0,1.3,0.5,2.6,1.5,3.5c0.9,0.9,2.2,1.5,3.5,1.5c1.3,0,2.6-0.5,3.5-1.5c0.9-0.9,1.5-2.2,1.5-3.5
	c0-1.3-0.5-2.6-1.5-3.5C48.3,62.6,47.1,62,45.7,62z M92,46c0,25.4-20.6,46-46,46S0,71.4,0,46S20.6,0,46,0S92,20.6,92,46z M84,46
	C84,25,67,8,46,8S8,25,8,46s17,38,38,38S84,67,84,46z"
    />
  </svg>
);

/* Icons.IconName */
export const Icons: any = {
  Plus: ({ className }: BaseProps) => (
    <svg
      enable-background="new 0 0 24 24"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 100 100"
      className={`w-6 ${className}`}
    >
      <polygon
        fill="#010101"
        points="80.2,51.6 51.4,51.6 51.4,22.6 48.9,22.6 48.9,51.6 19.9,51.6 19.9,54.1 48.9,54.1 48.9,83.1   51.4,83.1 51.4,54.1 80.4,54.1 80.4,51.6 "
      />
    </svg>
  ),
  QuestionMark
};

/* <Button>label</Button> */
export type ButtonProps = BaseProps & {
  type?: 'button' | 'submit' | undefined;
  primary?: boolean;
  width?: number;
};
export const Button = ({ type, onClick, children, className, isLoading, primary, width, style }: ButtonProps) => {
  let cn =
    'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm';
  if (primary) {
    cn = `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`;
  }
  return (
    <span className="inline-flex items-center">
      <button
        type={type ?? 'button'}
        onClick={onClick}
        className={`${cn} ${className}`}
        style={{ width: width ?? 'auto', ...style }}
      >
        {children}
      </button>
      {isLoading ? <Spinner /> : null}
    </span>
  );
};

/* <Dropdown label={'name'}><Child1 />...</Dropdown> */
type DropdownProps = BaseProps & {
  label?: React.ReactElement | string;
};
export const Dropdown = ({ label = 'label', children }: DropdownProps) => {
  return (
    <div>
      <div className="dropdown inline-block relative">
        <button className="font-semibold py-2 px-4 rounded inline-flex items-center">
          <span className="mr-1">{label}</span>
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{' '}
          </svg>
        </button>
        <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
          {React.Children.map(children, (child: any) => (
            <li className="">
              <a className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">
                {child}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* <Spinner /> */
export const Spinner = () => (
  <svg
    className="animate-spin ml-2 mr-2 h-5 w-5 text-gray"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

/* <Accordion openValue={true} /> */
export const Accordion = ({
  openValue,
  label,
  children
}: {
  openValue: boolean;
  label: React.ReactElement | string;
  children: React.ReactElement;
}) => {
  // source: https://codepen.io/QJan84/pen/zYvRMMw
  const openCount = React.useRef(0);
  const [open, setOpen] = React.useState(openValue);
  React.useEffect(() => {
    setOpen(openValue);
    if (openValue) {
      openCount.current++;
    }
  }, [openValue]);
  return (
    <div className="" x-data="{selected:null}">
      <ul className="shadow-box">
        <li className="relative border-b border-gray-200">
          <button
            type="button"
            className="w-full"
            onClick={() => {
              setOpen(!open);
              if (openValue) {
                openCount.current++;
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span>{label}</span>
              <span>{open ? '-' : '+'}</span>
            </div>
          </button>
          <div
            className={`relative overflow-hidden max-h-0 ${openCount.current > 1 ? 'transition-all duration-700' : ''}`}
            x-ref="container1"
            style={{ maxHeight: open ? 200 : 0 }}
          >
            {children}
          </div>
        </li>
      </ul>
    </div>
  );
};

export const Label = ({
  children,
  iconName,
  iconClick,
  className
}: {
  children: any;
  iconName?: string;
  iconClick?: any;
  className?: string;
}) => {
  const Icon = iconName ? Icons[iconName] : null;
  return (
    <div className="text-gray-400 mt-2 w-full flex flex-row items-center">
      <strong className={className}>{children}</strong>
      {iconName ? <Icon onClick={iconClick} className="w-4 h-4 ml-2 cursor-pointer" /> : null}
    </div>
  );
};

// source: https://tailwindui.com/components/application-ui/overlays/modals
export const Modal = ({
  title,
  content,
  onCancel,
  onConfirm
}: {
  title?: string;
  content?: any;
  onCancel?: () => void;
  onConfirm?: () => void;
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onCancel}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              {/* <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div> */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title ?? 'Title'}
                </h3>
                <div className="mt-2">{content ?? 'Content'}</div>
              </div>
            </div>
          </div>
          <div className="mb-4 bg-gray-50 px-4 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button primary onClick={onConfirm} width={100}>
              OK
            </Button>
            <Button onClick={onCancel} width={100}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
