import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
        404
      </h1>
      <h2 className="text-3xl font-bold mb-2">Ты заблудился в Пустоте, бродяга.</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Этой страницы не существует. Возможно, её сожрал Крипер, или ты просто ввел хуйню в адресную строку.
      </p>
      <Link href="/" className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all">
        Вернуться на базу
      </Link>
    </div>
  )
}
