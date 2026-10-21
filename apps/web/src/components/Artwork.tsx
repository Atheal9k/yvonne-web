import { useId } from 'react'

export type ArtworkKind = 'couple' | 'family' | 'pet' | 'studio' | 'live'

function Flower({
  x,
  y,
  scale = 1,
  color = '#a395bd',
}: {
  x: number
  y: number
  scale?: number
  color?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 3Q-10 36-3 61M-3 36Q-27 19-28 34Q-25 46-3 43M-3 50Q14 26 24 37Q25 48-3 55"
        fill="none"
        stroke="#788b62"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-10"
          rx="8"
          ry="12"
          transform={`rotate(${a})`}
          fill={color}
        />
      ))}
      <circle r="6" fill="#ebba58" />
    </g>
  )
}

function Person({
  x,
  y,
  dress = false,
  small = false,
  color = '#929d83',
  skin = '#e7ad8d',
  hair = '#4c342d',
}: {
  x: number
  y: number
  dress?: boolean
  small?: boolean
  color?: string
  skin?: string
  hair?: string
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${small ? 0.64 : 1})`}
      strokeLinejoin="round"
    >
      <path
        d="M-23 133L-26 213M24 133L27 213"
        stroke={skin}
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M-37 213h25v9h-39q-2-8 14-9M20 213h16q21 2 19 9H20"
        fill={hair}
      />
      {dress && (
        <path
          d="M-41-23Q-57-62-36-84Q-14-105 13-88Q48-90 47-41L55 37H-51Z"
          fill={hair}
        />
      )}
      <path
        d="M-35 24Q-53 49-65 105M34 24Q54 49 66 105"
        fill="none"
        stroke={skin}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d={
          dress
            ? 'M-30 10Q0 1 30 10L50 145Q0 164-51 145Z'
            : 'M-34 10Q0 1 34 10L39 100H-40Z'
        }
        fill={color}
      />
      {!dress && (
        <path d="M-39 98H38L34 202H9L0 129L-10 202H-35Z" fill="#e6dcc9" />
      )}
      <path d="M-9-15V12Q0 24 10 12V-15" fill={skin} />
      <ellipse cy="-45" rx="31" ry="39" fill={skin} />
      <path
        d={
          dress
            ? 'M-31-40Q-45-87-6-90Q36-94 34-46Q16-64 7-75Q-9-48-31-40Z'
            : 'M-32-46Q-45-91-8-91Q13-106 32-82Q43-68 31-47L21-67Q-11-59-29-64Z'
        }
        fill={hair}
      />
      <path
        d="M-13-42v3M12-42v3"
        stroke="#49332e"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M-6-23Q0-17 7-24"
        stroke="#895148"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="-19" cy="-30" rx="6" ry="3" fill="#d98278" opacity=".6" />
      <ellipse cx="20" cy="-30" rx="6" ry="3" fill="#d98278" opacity=".6" />
      {dress && (
        <g fill="#f4e5ca" opacity=".85">
          {[35, 65, 95, 125].map((yy) => (
            <g key={yy}>
              <path d={`M-19 ${yy}l-4-6-3 6 3 6Z`} />
              <path d={`M15 ${yy + 10}l-4-6-3 6 3 6Z`} />
              <circle cx="1" cy={yy} r="2" />
            </g>
          ))}
        </g>
      )}
      {!dress && (
        <>
          <path
            d="M-9 7L0 22 10 7M0 22V85"
            stroke="#61735e"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M12 35H27V51H12Z"
            stroke="#61735e"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      )}
    </g>
  )
}

function Dog({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number
  y?: number
  scale?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M36 60Q84 25 73 2"
        stroke="#c78b4c"
        strokeWidth="15"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cy="47" rx="43" ry="59" fill="#d9a665" />
      <path
        d="M-22 68L-24 106M22 68L24 106"
        stroke="#d9a665"
        strokeWidth="21"
        strokeLinecap="round"
      />
      <ellipse cy="-14" rx="43" ry="43" fill="#e4b477" />
      <path
        d="M-30-45Q-61-47-57 10Q-47 42-28 9ZM29-45Q61-47 57 10Q47 42 28 9Z"
        fill="#b97f42"
      />
      <path d="M-33 16L0 50 34 16Q0 31-33 16" fill="#a79bc3" />
      <path
        d="M-11-17v3M12-17v3"
        stroke="#4c342d"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cy="-1" rx="9" ry="6" fill="#553b2e" />
      <path
        d="M0 5V14M-10 11Q0 22 11 11"
        fill="none"
        stroke="#553b2e"
        strokeWidth="2"
      />
      <path d="M-3 18Q0 40 9 27L9 17" fill="#d8887c" />
    </g>
  )
}

export function Artwork({
  kind = 'couple',
  className = '',
  label,
}: {
  kind?: ArtworkKind
  className?: string
  label?: string
}) {
  const id = useId().replaceAll(':', '')
  const background =
    kind === 'pet'
      ? '#f4e4cd'
      : kind === 'family'
        ? '#e4e8d8'
        : kind === 'studio'
          ? '#eaddd7'
          : '#ede7f2'
  return (
    <svg
      className={`artwork ${className}`}
      viewBox="0 0 480 520"
      role="img"
      aria-label={label ?? `${kind} portrait illustration`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`${id}-grain`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="2" r=".55" fill="#8f7765" opacity=".14" />
          <circle cx="5" cy="6" r=".4" fill="#8f7765" opacity=".13" />
        </pattern>
        <pattern
          id={`${id}-gingham`}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0H48V24H0Z M0 0H24V48H0Z" fill="#e9bd8e" opacity=".16" />
        </pattern>
      </defs>
      <path fill="#fffaf0" d="M0 0H480V520H0Z" />
      <path d="M35 260a205 205 0 0 1 410 0v226H35Z" fill={background} />
      {kind === 'pet' && (
        <path
          d="M35 260a205 205 0 0 1 410 0v226H35Z"
          fill={`url(#${id}-gingham)`}
        />
      )}
      <g fill="#dcb878">
        <path d="M92 128l3-13 3 13 12 3-12 3-3 13-3-13-12-3Z" />
        <path d="M385 219l2-9 2 9 9 2-9 2-2 9-2-9-9-2Z" />
        <circle cx="367" cy="122" r="3" />
        <circle cx="109" cy="280" r="2" />
      </g>
      <ellipse
        cx="240"
        cy="452"
        rx="138"
        ry="13"
        fill="#a5977b"
        opacity=".12"
      />
      {kind === 'couple' && (
        <>
          <Person x={173} y={238} dress color="#aa9bbb" />
          <Person x={304} y={235} color="#909c81" />
          <Dog x={243} y={411} scale={0.44} />
        </>
      )}
      {kind === 'live' && (
        <>
          <Person x={176} y={235} dress color="#f0e5d5" hair="#5a3c30" />
          <Person
            x={308}
            y={235}
            color="#b79579"
            skin="#bb805d"
            hair="#352e2c"
          />
          <g transform="translate(151 281)">
            <Flower x={0} y={0} scale={0.75} color="#dca3a0" />
            <Flower x={-15} y={0} scale={0.55} color="#ead39b" />
          </g>
        </>
      )}
      {kind === 'family' && (
        <>
          <Person x={145} y={234} dress color="#c98e88" />
          <Person x={331} y={227} color="#8f9eae" />
          <Person x={239} y={310} dress small color="#cc9c62" hair="#7d5339" />
          <path
            d="M205 341Q225 335 230 341M251 341Q264 331 270 334"
            stroke="#e7ad8d"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === 'pet' && <Dog x={240} y={309} scale={1.15} />}
      {kind === 'studio' && (
        <>
          <Person x={250} y={245} dress color="#a69bb8" hair="#44312c" />
          <path d="M80 337H409L431 365H60Z" fill="#bd8e69" />
          <path d="M78 364V485M410 364V485" stroke="#956b4f" strokeWidth="13" />
          <path d="M136 312l83-16 10 46-83 10Z" fill="#fff9ed" />
          <path
            d="M159 320q20-28 37 8"
            fill="none"
            stroke="#a49ab8"
            strokeWidth="4"
          />
          <path d="M340 287h29l-5 54h-18Z" fill="#e0b77d" />
          <path
            d="M346 289l-9-51M352 290l9-62M359 290l14-42"
            stroke="#7b8262"
            strokeWidth="5"
          />
          <ellipse cx="293" cy="340" rx="30" ry="8" fill="#e5d8c2" />
          <circle cx="282" cy="338" r="4" fill="#b284a7" />
          <circle cx="299" cy="339" r="4" fill="#909a74" />
        </>
      )}
      <Flower x={83} y={367} scale={0.8} color="#b5a7cc" />
      <Flower
        x={389}
        y={371}
        scale={0.95}
        color={kind === 'pet' ? '#e8c363' : '#d6a2a2'}
      />
      <Flower x={65} y={402} scale={0.55} color="#e0bc7c" />
      <Flower x={416} y={417} scale={0.53} color="#aca3bd" />
      <path
        d="M66 464q15-67 37-48M395 468q-10-58 15-48"
        fill="none"
        stroke="#84916c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M0 0H480V520H0Z" fill={`url(#${id}-grain)`} />
    </svg>
  )
}

export function DoodleFlower({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2">
        <path d="M50 36C23 5 10 33 36 50C3 64 25 92 48 65C57 99 88 78 64 54C99 44 77 12 55 36C62 3 33 1 41 35" />
        <circle cx="50" cy="50" r="13" />
      </g>
    </svg>
  )
}
