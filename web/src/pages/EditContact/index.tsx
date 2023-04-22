import { FormHandles } from '@unform/core';
import { format, parse } from 'date-fns';
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FiGift,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiPlusCircle,
  FiTag,
  FiX,
  FiXCircle,
} from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import NormalInput from '../../components/NormalInput';
import ReadOnlyInput from '../../components/ReadOnlyInput';

import { useInformations } from '../../hooks/informations';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { ContactData } from '../ContactsList/Contact';
import createContactSchema from './schema';

import {
  Container,
  ContactHeader,
  ContactBody,
  Section,
  TagsContainer,
  TagContainer,
  ButtonsContainer,
} from './styles';

interface EditContactParams {
  id?: string;
}

interface FormData {
  name: string;
  surname: string;
  birthday: string;
  observation: string;
  phones: { number: string; description: string }[];
  emails: { email: string; description: string }[];
  addresses: {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    number: string;
    complement: string;
    description: string;
  }[];
}

// Classe muito complexa e com muitas responsabilidades
// Necessita de refatoração
const EditContact: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { id } = useParams<EditContactParams>();
  const { getContactById } = useInformations();
  const { addToast } = useToast();
  const history = useHistory();
  const { updateContact, insertContact } = useInformations();

  const contact = useMemo(
    () => (id ? getContactById(id) : undefined) || ({} as ContactData),
    [getContactById, id],
  );

  const [tagText, setTagText] = useState('');
  const [tags, setTags] = useState<string[]>(
    (contact?.categories || []).map(({ name }) => name),
  );
  const [phonesAmount, setPhonesAmount] = useState(
    contact?.phones?.length || 1,
  );
  const [emailsAmount, setEmailsAmount] = useState(
    contact?.emails?.length || 1,
  );
  const [addressesAmount, setAddressesAmount] = useState(
    contact?.addresses?.length || 1,
  );

  const [imageToChange, setImageToChange] = useState<File | undefined>();

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files ? e.target.files[0] : undefined;

    setImageToChange(file);
  }, []);

  const handlePhoneRemove = useCallback(
    (position: number) => {
      if (phonesAmount === 1) {
        formRef.current?.setData({
          phones: [
            {
              number: '',
              description: '',
            },
          ],
        });
      } else {
        const data = formRef.current?.getData() as ContactData;

        const phones = data?.phones || [];

        phones.splice(position, 1);

        formRef.current?.setData({ phones });

        setPhonesAmount(oldAmount => oldAmount - 1);
      }
    },
    [phonesAmount],
  );

  const handleEmailRemove = useCallback(
    (position: number) => {
      if (emailsAmount === 1) {
        formRef.current?.setData({
          emails: [
            {
              email: '',
              description: '',
            },
          ],
        });
      } else {
        const data = formRef.current?.getData() as ContactData;

        const emails = data?.emails || [];

        emails.splice(position, 1);

        formRef.current?.setData({ emails });

        setEmailsAmount(oldAmount => oldAmount - 1);
      }
    },
    [emailsAmount],
  );

  const handleAddressRemove = useCallback(
    (position: number) => {
      if (addressesAmount === 1) {
        formRef.current?.setData({
          addresses: [
            {
              cep: '',
              state: '',
              city: '',
              neighborhood: '',
              address: '',
              number: '',
              complement: '',
              description: '',
            },
          ],
        });
      } else {
        const data = formRef.current?.getData() as ContactData;

        const addresses = data?.addresses || [];

        addresses.splice(position, 1);

        formRef.current?.setData({ addresses });

        setAddressesAmount(oldAmount => oldAmount - 1);
      }
    },
    [addressesAmount],
  );

  const findInfoByCep = useCallback(
    async (cep: string, position: number) => {
      try {
        const response = await api.get(
          `https://viacep.com.br/ws/${cep}/json/`,
          {
            headers: [],
          },
        );

        if (response.status === 200) {
          const addresses =
            (formRef.current?.getData() as ContactData).addresses || [];

          addresses[position].state = response.data.uf;
          addresses[position].city = response.data.localidade;
          addresses[position].neighborhood = response.data.bairro;
          addresses[position].address = response.data.logradouro;

          formRef.current?.setData({ addresses });
        } else throw new Error('Erro ao buscar CEP');
      } catch (e) {
        addToast({
          type: 'error',
          title: 'Erro ao buscar CEP',
        });
      }
    },
    [addToast],
  );

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        const sanitizedData = {
          ...data,
          emails: data.emails.filter(email => email.email),
          phones: data.phones.filter(phone => phone.number),
          addresses: data.addresses.filter(address => address.cep),
          categories: tags.map(t => ({ name: t })),
          birthday: data.birthday
            ? parse(data.birthday, 'dd/MM/yyyy', new Date())
            : undefined,
          isFavorite: !!contact?.isFavorite,
        };

        await createContactSchema.validate(sanitizedData, {
          abortEarly: false,
        });

        const response = await (id
          ? api.put(`/contacts/${id}`, sanitizedData)
          : api.post('/contacts', sanitizedData));

        if (response.status === 201 || response.status === 200) {
          if (imageToChange) {
            const bodyFormData = new FormData();

            bodyFormData.append('photo', imageToChange);

            const responsePhoto = await api.put(
              `/contacts/${response.data.id}/photo`,
              bodyFormData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );

            if (responsePhoto.status === 200) {
              if (id) {
                updateContact({
                  ...response.data,
                  photoName: responsePhoto.data.contact.photoName,
                });
              } else {
                insertContact({
                  ...response.data,
                  photoName: responsePhoto.data.contact.photoName,
                });
              }

              addToast({
                type: 'success',
                title: `Contato ${id ? 'atualizado' : 'criado'} com sucesso`,
              });
            } else {
              addToast({
                type: 'info',
                title: `Contato ${
                  id ? 'atualizado' : 'criado'
                } com sucesso, porém ocorreu um erro com sua foto`,
              });
              throw new Error('Erro ao alterar imagem');
            }
          } else {
            if (id) {
              updateContact(response.data);
            } else {
              insertContact(response.data);
            }
            addToast({
              type: 'success',
              title: `Contato ${id ? 'atualizado' : 'criado'} com sucesso`,
            });
          }

          history.push(`/contato/${response.data.id}`);
        } else {
          if (response.status === 400) {
            formRef?.current?.setErrors(response.data.validationErrors);
          }

          throw new Error('Erro ao criar conta');
        }
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          formRef?.current?.setErrors(getValidationErrors(e));
        }

        addToast({
          type: 'error',
          title: 'Erro na criação',
          description: 'Ocorreu um erro ao criar o contato',
        });
      }
    },
    [
      addToast,
      contact?.isFavorite,
      history,
      id,
      imageToChange,
      insertContact,
      tags,
      updateContact,
    ],
  );

  return (
    <Container
      ref={formRef}
      onSubmit={handleSubmit}
      initialData={{
        ...contact,
        birthday: contact?.birthday
          ? format(contact.birthday, 'dd/MM/yyyy')
          : null,
      }}
    >
      <ContactHeader>
        <div>
          <label htmlFor="photo-input">
            {contact?.photoName || imageToChange ? (
              <img
                src={
                  imageToChange
                    ? URL.createObjectURL(imageToChange)
                    : `http://localhost:3333/files/${contact.photoName}`
                }
                alt="Foto de perfil"
              />
            ) : (
              <FiPlus size={48} />
            )}
          </label>
          <input
            id="photo-input"
            type="file"
            onChange={handleImageChange}
            hidden
          />
        </div>
        <div>
          <Input name="name" placeholder="Nome" inverted />
          <Input name="surname" placeholder="Sobrenome" inverted />
        </div>
      </ContactHeader>
      <ContactBody>
        <div>
          <Section>
            <FiPhone size={24} />
            <div>
              {new Array(phonesAmount).fill(0).map((_, i) => (
                <div>
                  <div>
                    <Input
                      name={`phones[${i}].number`}
                      placeholder="Telefone"
                    />
                    <Input
                      name={`phones[${i}].description`}
                      placeholder="Descrição"
                    />
                  </div>
                  <div>
                    <Button
                      borderless
                      noMargin
                      onClick={() => handlePhoneRemove(i)}
                    >
                      <FiXCircle size={24} />
                    </Button>
                    {i === phonesAmount - 1 && (
                      <Button
                        borderless
                        noMargin
                        onClick={() => {
                          setPhonesAmount(oldAmount => oldAmount + 1);
                        }}
                      >
                        <FiPlusCircle size={24} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section>
            <FiMail size={24} />
            <div>
              {new Array(emailsAmount).fill(0).map((_, i) => (
                <div>
                  <div>
                    <Input name={`emails[${i}].email`} placeholder="E-mail" />
                    <Input
                      name={`emails[${i}].description`}
                      placeholder="Descrição"
                    />
                  </div>
                  <div>
                    <Button
                      borderless
                      noMargin
                      onClick={() => handleEmailRemove(i)}
                    >
                      <FiXCircle size={24} />
                    </Button>
                    {i === emailsAmount - 1 && (
                      <Button
                        borderless
                        noMargin
                        onClick={() => {
                          setEmailsAmount(oldAmount => oldAmount + 1);
                        }}
                      >
                        <FiPlusCircle size={24} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section>
            <FiMapPin size={24} />
            <div>
              {new Array(addressesAmount).fill(0).map((_, i) => (
                <div>
                  <div>
                    <Input
                      name={`addresses[${i}].cep`}
                      placeholder="CEP"
                      onChange={({ target: { value } }) => {
                        if (value.trim().length === 8)
                          findInfoByCep(value.trim(), i);
                      }}
                    />
                    <ReadOnlyInput name={`addresses[${i}].state`} />
                    <ReadOnlyInput name={`addresses[${i}].city`} />
                    <ReadOnlyInput name={`addresses[${i}].neighborhood`} />
                    <ReadOnlyInput name={`addresses[${i}].address`} />
                    <Input
                      name={`addresses[${i}].number`}
                      placeholder="Número"
                    />
                    <Input
                      name={`addresses[${i}].complement`}
                      placeholder="Complemento"
                    />
                    <Input
                      name={`addresses[${i}].description`}
                      placeholder="Descrição"
                    />
                  </div>
                  <div>
                    <Button
                      borderless
                      noMargin
                      onClick={() => handleAddressRemove(i)}
                    >
                      <FiXCircle size={24} />
                    </Button>
                    {i === addressesAmount - 1 && (
                      <Button
                        borderless
                        noMargin
                        onClick={() => {
                          setAddressesAmount(oldAmount => oldAmount + 1);
                        }}
                      >
                        <FiPlusCircle size={24} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div>
          <Section>
            <FiTag size={24} />
            <div>
              <div>
                <NormalInput
                  placeholder="Categoria"
                  onChange={({ target: { value } }) => setTagText(value)}
                />
                <Button
                  borderless
                  onClick={() => {
                    setTags(oldTags => [...oldTags, tagText]);
                  }}
                >
                  <FiPlusCircle size={24} />
                </Button>
              </div>
              <TagsContainer>
                {tags.map((tag, i) => (
                  <TagContainer key={tag}>
                    {tag}
                    <FiX
                      size={16}
                      onClick={() => {
                        setTags(oldTags =>
                          oldTags.filter((_, oldI) => oldI !== i),
                        );
                      }}
                    />
                  </TagContainer>
                ))}
              </TagsContainer>
            </div>
          </Section>
          <Section>
            <FiGift size={24} />
            <div>
              <Input name="birthday" placeholder="Data de nascimento" />
            </div>
          </Section>
          <Section>
            <FiMessageSquare size={24} />
            <div>
              <Input name="observation" placeholder="Observação" />
            </div>
          </Section>
        </div>
      </ContactBody>
      <ButtonsContainer>
        <Button type="submit">Salvar</Button>
        <Button inverted onClick={() => history.push('/')}>
          Cancelar
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default EditContact;
