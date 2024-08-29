'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import languageState from '../../atoms/languageAtom'
import './style.css'

const translations = {
	en: {
		formTitle: 'Design Order Form',
		selectDesignType: 'Select Design Type',
		customDesignTypePlaceholder: 'Enter your custom design type',
		designTextPlaceholder: 'Enter your design text',
		colorPlaceholder: 'Enter your preferred color',
		designElementsPlaceholder: 'Enter design elements (e.g., car or character)',
		widthPlaceholder: 'Enter width (px, sm, vh)',
		heightPlaceholder: 'Enter height (px, sm, vh)',
		fileSizePlaceholder: 'Enter file size (MB, GB, TB)',
		additionalInfoPlaceholder: 'Additional information or suggestions',
		telegramUsernamePlaceholder: 'Enter your Telegram username',
		submitButton: 'Submit Order',
		successMessage: 'Your order has been successfully sent!',
		designTypes: [
			{ value: 'avatar', label: 'Avatar' },
			{ value: 'forum_design', label: 'Forum Thread Design' },
			{ value: 'music_video', label: 'Music Video' },
			{ value: 'promo_video', label: 'Promo Video' },
			{ value: 'banner', label: 'Banner' },
			{ value: 'logo', label: 'Logo' },
			{ value: 'other', label: 'Other' },
		],
	},
	ru: {
		formTitle: 'Форма заказа дизайна',
		selectDesignType: 'Выберите тип дизайна',
		customDesignTypePlaceholder: 'Укажите свой вариант дизайна',
		designTextPlaceholder: 'Введите текст дизайна',
		colorPlaceholder: 'Введите предпочтительный цвет',
		designElementsPlaceholder:
			'Введите элементы дизайна (например, машина или персонаж)',
		widthPlaceholder: 'Введите ширину (px, sm, vh)',
		heightPlaceholder: 'Введите высоту (px, sm, vh)',
		fileSizePlaceholder: 'Введите размер файла (МБ, ГБ, ТБ)',
		additionalInfoPlaceholder: 'Дополнительная информация или советы',
		telegramUsernamePlaceholder:
			'Оставьте свой username для связи через Telegram',
		submitButton: 'Отправить заказ',
		successMessage: 'Ваш заказ успешно отправлен!',
		designTypes: [
			{ value: 'avatar', label: 'Аватарка' },
			{ value: 'forum_design', label: 'Форумное оформление темы' },
			{ value: 'music_video', label: 'Клип под музыку' },
			{ value: 'promo_video', label: 'Промо-ролик' },
			{ value: 'banner', label: 'Баннер' },
			{ value: 'logo', label: 'Логотип' },
			{ value: 'other', label: 'Другое' },
		],
	},
}

const DesignOrderForm: React.FC = () => {
	const [formData, setFormData] = useState({
		designType: '',
		customDesignType: '',
		designText: '',
		color: '',
		designElements: '',
		width: '',
		height: '',
		fileSize: '',
		additionalInfo: '',
		telegramUsername: '',
	})
	const [selectedLanguage] = useRecoilState(languageState)

	const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
	const chat_id = 1832735702

	const sendToTelegramBot = async () => {
		const message = `
      🉐НОВЫЙ ЗАКАЗ ДИЗАЙНА🉐:
      ТИП ДИЗАЙНА: ${
				formData.designType === 'other'
					? formData.customDesignType
					: formData.designType
			}
      ТЕКСТ: ${formData.designText}
      ЦВЕТ: ${formData.color}
      ЭЛЕМЕНТЫ ДИЗАЙНА: ${formData.designElements}
      РАЗМЕР: ${formData.width}x${formData.height}
      РАЗМЕР ФАЙЛА: ${formData.fileSize || 'Не указано'}
      ДОП ИНФОРМАЦИЯ: ${formData.additionalInfo}
      Telegram: ${formData.telegramUsername}
    `

		try {
			const response = await fetch(
				`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						chat_id,
						text: message,
					}),
				}
			)

			if (!response.ok) {
				throw new Error('Failed to send message to Telegram')
			} else {
				toast.success(translations[selectedLanguage].successMessage)
			}
		} catch (error) {
			console.error('Error:', error)
			toast.error('Произошла ошибка при отправке сообщения.')
		}
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type, selectedOptions }: any = e.target

		if (type === 'select-one') {
			setFormData(prev => ({
				...prev,
				[name]: selectedOptions[0].value,
			}))
		} else {
			setFormData(prev => ({
				...prev,
				[name]: value,
			}))
		}
	}

	const validateForm = (): boolean => {
		const errors: string[] = []

		if (!formData.designType)
			errors.push(translations[selectedLanguage].selectDesignType)
		if (formData.designType === 'other' && !formData.customDesignType.trim()) {
			errors.push(translations[selectedLanguage].customDesignTypePlaceholder)
		}
		if (!formData.designText.trim())
			errors.push(translations[selectedLanguage].designTextPlaceholder)
		if (!formData.color.trim())
			errors.push(translations[selectedLanguage].colorPlaceholder)
		if (!formData.designElements.trim())
			errors.push(translations[selectedLanguage].designElementsPlaceholder)
		if (!formData.width.trim() || !formData.height.trim())
			errors.push(translations[selectedLanguage].widthPlaceholder)
		if (!formData.additionalInfo.trim())
			errors.push(translations[selectedLanguage].additionalInfoPlaceholder)
		if (!formData.telegramUsername.trim())
			errors.push(translations[selectedLanguage].telegramUsernamePlaceholder)

		if (errors.length > 0) {
			errors.forEach(error => toast.error(error))
			return false
		}
		return true
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validateForm()) {
			sendToTelegramBot()
			setFormData({
				designType: '',
				customDesignType: '',
				designText: '',
				color: '',
				designElements: '',
				width: '',
				height: '',
				fileSize: '',
				additionalInfo: '',
				telegramUsername: '',
			})
		}
	}

	const t = translations[selectedLanguage]

	return (
		<form
			onSubmit={handleSubmit}
			className='max-w-full mx-auto mt-10 p-6 bg-[#191919] rounded-lg shadow-xl'
		>
			<h2 className='text-2xl font-bold mb-6 text-white'>{t.formTitle}</h2>

			<div className='mb-4'>
				<label className='block text-white mb-2'>{t.selectDesignType}</label>
				<select
					name='designType'
					value={formData.designType}
					onChange={handleInputChange}
					className={`w-full p-2 border rounded bg-[#222222] text-white`}
				>
					<option value='' disabled>
						{t.selectDesignType}
					</option>
					{t.designTypes.map(type => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>

			{formData.designType === 'other' && (
				<input
					type='text'
					name='customDesignType'
					value={formData.customDesignType}
					onChange={handleInputChange}
					placeholder={t.customDesignTypePlaceholder}
					className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
				/>
			)}

			<input
				type='text'
				name='designText'
				value={formData.designText}
				onChange={handleInputChange}
				placeholder={t.designTextPlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			/>

			<input
				type='text'
				name='color'
				value={formData.color}
				onChange={handleInputChange}
				placeholder={t.colorPlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			/>

			<input
				type='text'
				name='designElements'
				value={formData.designElements}
				onChange={handleInputChange}
				placeholder={t.designElementsPlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			/>

			<div className='flex gap-3'>
				<input
					type='text'
					name='width'
					value={formData.width}
					onChange={handleInputChange}
					placeholder={t.widthPlaceholder}
					className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
				/>

				<input
					type='text'
					name='height'
					value={formData.height}
					onChange={handleInputChange}
					placeholder={t.heightPlaceholder}
					className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
				/>
			</div>

			<input
				type='text'
				name='fileSize'
				value={formData.fileSize}
				onChange={handleInputChange}
				placeholder={t.fileSizePlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			/>

			<textarea
				name='additionalInfo'
				value={formData.additionalInfo}
				onChange={handleInputChange}
				placeholder={t.additionalInfoPlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			></textarea>

			<input
				type='text'
				name='telegramUsername'
				value={formData.telegramUsername}
				onChange={handleInputChange}
				placeholder={t.telegramUsernamePlaceholder}
				className={`w-full p-2 border rounded mb-4 bg-[#222222] text-white`}
			/>

			<button
				type='submit'
				className='w-full p-2 border rounded bg-[#E32879] text-white'
			>
				{t.submitButton}
			</button>
		</form>
	)
}

export default DesignOrderForm
