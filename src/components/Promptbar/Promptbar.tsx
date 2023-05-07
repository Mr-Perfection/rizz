import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { savePrompts } from '@/utils/app/prompts';

import { OpenAIModels } from '@/types/openai';
// import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { PromptFolders } from './components/PromptFolders';
import { PromptbarSettings } from './components/PromptbarSettings';
import { Prompts } from './components/Prompts';

import Sidebar from '../Sidebar';
import PromptbarContext from './PromptBar.context';
import { PromptbarInitialState, initialState } from './Promptbar.state';

import { v4 as uuidv4 } from 'uuid';
import { Session, SupabaseClient, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/db_types';
import { Prompt } from '@/types/prompt';
import { PromptModal } from '@/components/Promptbar/components/PromptModal';

const Promptbar = () => {
  const { t } = useTranslation('promptbar');
  const { isLoading,
    supabaseClient,
    session }: { isLoading: boolean, supabaseClient: SupabaseClient<Database>, session: Session | null }
    = useSessionContext();
  
    const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    initialState,
  });

  const ownerId = session!.user.id
  const [newPrompt] = useState<Prompt>({
    owner: ownerId,
    name: '',
    description: '',
    content: '',
  })

  const [showNewPromptModal, setShowNewPromptModal] = useState<boolean>(false)
  const {
    state: { prompts, defaultModelId, showPromptbar },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('prompts').select('*');
      homeDispatch({ field: 'prompts', value: data });
    }

    if (prompts === undefined) loadData();
  }, [prompts, supabaseClient, homeDispatch]);

  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleTogglePromptbar = () => {
    homeDispatch({ field: 'showPromptbar', value: !showPromptbar });
    localStorage.setItem('showPromptbar', JSON.stringify(!showPromptbar));
  };

  const handleCreatePrompt = async (prompt: Prompt) => {
    if (defaultModelId) {
      const newPrompt = prompt as Database['public']['Tables']['prompts']['Insert']
      const { error } = await supabaseClient.from('prompts').insert(newPrompt);
      console.log('error ', error, newPrompt)
      if (error) {
        // log error or alert the user.
        alert('Error creating a new prompt! Please contact us if the problem persists.')
        return
      }
      const updatedPrompts = [...prompts ?? [], newPrompt]
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      savePrompts(updatedPrompts);
    }
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts!.filter((p) => p.id !== prompt.id);

    homeDispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);
  };

  const handleUpdatePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts!.map((p) => {
      if (p.id === prompt.id) {
        return prompt;
      }

      return p;
    });
    homeDispatch({ field: 'prompts', value: updatedPrompts });

    savePrompts(updatedPrompts);
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      handleUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts!.filter((prompt) => {
          const searchable =
            prompt.name?.toLowerCase() +
            ' ' +
            prompt.description?.toLowerCase() +
            ' ' +
            prompt.content?.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
    // Prevent infinite refresh if we add prompts as dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <PromptbarContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      {showNewPromptModal && (
        <PromptModal
          prompt={newPrompt}
          onClose={() => setShowNewPromptModal(false)}
          onUpdatePrompt={handleCreatePrompt}
        />
      )}
      <Sidebar<Prompt>
        side={'right'}
        isOpen={showPromptbar}
        addItemButtonTitle={t('New prompt')}
        itemComponent={
          <Prompts
            // prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
            prompts={filteredPrompts}
          />
        }
        folderComponent={<PromptFolders />}
        items={filteredPrompts}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          promptDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleTogglePromptbar}
        handleCreateItem={() => setShowNewPromptModal(true)}
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'prompt')}
        handleDrop={handleDrop}
      />
    </PromptbarContext.Provider>
  );
};

export default Promptbar;
